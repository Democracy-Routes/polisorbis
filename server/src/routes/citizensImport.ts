// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// POST /api/v3/citizens/import: one call that creates a conversation and
// adds the seed statements exported by Citizens (the citizens' assembly app
// of Democracy Routes). Authenticated with an API key
// (`Authorization: Bearer <key>`, issued by deploy/prod/create-apikey.sh).
// Validation and the personal-data guard live in utils/citizensImport.ts.
// Outside server.ts because that module shadows Promise with bluebird.

import fail from "../utils/fail";
import logger from "../utils/logger";
import { makeBudget } from "../utils/rateLimit";
import { findPersonalDataIn, validateImport, ImportRequest } from "../utils/citizensImport";
import { insertSeedComments, SeedHelpers } from "./commentsBulk";

const overBudget = makeBudget(20, 60 * 60 * 1000);

export type ConversationFields = {
  topic: string;
  description: string;
  context: string;
  strict_moderation: boolean;
};

type Helpers = SeedHelpers & {
  /** Inserts a conversation owned by uid; resolves to its zid. */
  insertConversation: (uid: any, fields: ConversationFields) => PromiseLike<any>;
  /** Registers and returns the public id (zinvite) for a zid. */
  generateAndRegisterZinvite: (zid: any, shortUrl?: boolean) => PromiseLike<any>;
  getZinvite: (zid: any, dontUseCache?: boolean) => PromiseLike<any>;
  /** Creates a report row; resolves to the report id. */
  createReport: (zid: any) => PromiseLike<any>;
  getServerNameWithProtocol: (req: any) => string;
};

export function makeHandlePostCitizensImport(h: Helpers) {
  return async function handle_POST_citizens_import(
    req: { p: { uid?: any }; body: any },
    res: any
  ) {
    const uid = req.p && req.p.uid;
    if (!uid) {
      fail(res, 401, "polis_err_auth_token_not_supplied");
      return;
    }
    const v = validateImport(req.body);
    if (!v.ok) {
      res.status(400); res.json({ error: "polis_err_citizens_import_invalid", details: v.errors });
      return;
    }
    const request: ImportRequest = v.request;
    const hits = findPersonalDataIn(request.statements);
    if (hits.length) {
      res.status(400); res.json({ error: "polis_err_citizens_import_personal_data", details: hits });
      return;
    }
    if (overBudget(uid)) {
      fail(res, 429, "polis_err_citizens_import_rate_limited");
      return;
    }

    try {
      let zid: number | null = null;
      let created = false;
      if (request.reuse) {
        const rows = await h.pgQueryP(
          "select zid from conversations where owner = ($1) and context = ($2) order by zid desc limit 1;",
          [uid, request.context]
        );
        if (rows && rows.length) zid = Number(rows[0].zid);
      }
      if (zid === null) {
        zid = await h.insertConversation(uid, {
          topic: request.topic,
          description: request.description,
          context: request.context,
          strict_moderation: request.strictModeration,
        });
        await h.generateAndRegisterZinvite(zid, false);
        await h.createReport(zid);
        created = true;
      }
      const conversation_id = await h.getZinvite(zid);
      const reportRows = await h.pgQueryP(
        "select report_id from reports where zid = ($1) order by rid asc limit 1;",
        [zid]
      );
      const report_id = reportRows && reportRows.length ? reportRows[0].report_id : null;

      const texts = request.statements.map((s) => s.statement);
      const { results } = await insertSeedComments(h, zid, uid, texts);
      const perStatement = results.map((r, i) => ({
        position: request.statements[i].position,
        status: r.status,
        tid: r.tid,
        reason: r.reason,
      }));
      const count = (status: string) => results.filter((r) => r.status === status).length;
      const base = h.getServerNameWithProtocol(req);
      res.json({
        conversation_id,
        url: base + "/" + conversation_id,
        moderation_url: base + "/m/" + conversation_id,
        report_url: report_id ? base + "/report/" + report_id : null,
        created,
        statements: {
          added: count("success"),
          skipped_duplicate: results.filter((r) => r.reason === "polis_err_post_comment_duplicate").length,
          failed: count("error"),
          results: perStatement,
        },
      });
    } catch (err) {
      logger.error("polis_err_citizens_import", err);
      fail(res, 500, "polis_err_citizens_import");
    }
  };
}
