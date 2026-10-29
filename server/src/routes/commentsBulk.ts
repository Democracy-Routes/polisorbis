// SPDX-FileCopyrightText: 2012-present The Polis Authors
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// POST /api/v3/comments-bulk: seed statements from a CSV uploaded by a
// moderator in the admin page. Ported from compdemocracy/polis 2.42.2
// (handle_POST_comments_bulk); see utils/seedCsv.ts for the accepted columns.
// It lives outside server.ts because that module shadows the global Promise
// with bluebird, which TypeScript refuses next to an async function.

import _ from "underscore";
import fail from "../utils/fail";
import logger from "../utils/logger";
import { parseSeedCsv } from "../utils/seedCsv";

// The statement limit the admin page and Citizens use (the server's own
// ceiling for POST /api/v3/comments is 997).
export const MAX_LENGTH = 400;

export type SeedHelpers = {
  getPidPromise: (zid: any, uid: any, usePrimary?: boolean) => PromiseLike<any>;
  addParticipant: (zid: any, uid?: any) => PromiseLike<any>;
  commentExists: (zid: any, txt: any) => PromiseLike<any>;
  detectLanguage: (txt: any) => PromiseLike<any>;
  pgQueryP: (query: string, params: any[]) => PromiseLike<any>;
  updateLastInteractionTimeForConversation: (zid: any, uid?: any) => any;
  modOk: number;
};

type Helpers = SeedHelpers & {
  isModerator: (zid: any, uid?: any) => PromiseLike<any>;
};

export type SeedResult = { txt: string; status: "success" | "skipped" | "error"; tid?: number; reason?: string };

/**
 * Inserts seed statements for a conversation on behalf of `uid` (already
 * known to be allowed), one row at a time so duplicates within the same
 * batch are caught too. Returns one result per input text, in order.
 */
export async function insertSeedComments(
  h: SeedHelpers,
  zid: any,
  uid: any,
  texts: string[],
  knownPid?: any
): Promise<{ results: SeedResult[]; pid: any }> {
  let pid = knownPid;
  if (_.isUndefined(pid) || Number(pid) === -1) {
    pid = await h.getPidPromise(zid, uid, true);
    if (pid === -1) {
      const rows = await h.addParticipant(zid, uid);
      pid = rows[0].pid;
    }
  }

  const results: SeedResult[] = [];
  for (const raw of texts) {
    const txt = (raw || "").trim();
    if (!txt) {
      results.push({ txt, status: "skipped", reason: "polis_err_param_missing_txt" });
      continue;
    }
    if (txt.length > MAX_LENGTH) {
      results.push({ txt, status: "skipped", reason: "polis_err_comment_too_long" });
      continue;
    }
    try {
      if (await h.commentExists(zid, txt)) {
        results.push({ txt, status: "skipped", reason: "polis_err_post_comment_duplicate" });
        continue;
      }
      const detections = await h.detectLanguage(txt);
      const detection = Array.isArray(detections) ? detections[0] : detections;
      const rows = await h.pgQueryP(
        "INSERT INTO COMMENTS " +
          "(pid, zid, txt, velocity, active, mod, uid, anon, is_seed, created, tid, lang, lang_confidence) VALUES " +
          "($1, $2, $3, 1, true, $4, $5, false, true, default, null, $6, $7) RETURNING tid;",
        [pid, zid, txt, h.modOk, uid, detection.language, detection.confidence]
      );
      results.push({ txt, status: "success", tid: rows[0].tid });
    } catch (err) {
      logger.error("polis_err_bulk_comment_item", err);
      results.push({ txt, status: "error", reason: "polis_err_post_comment" });
    }
  }
  if (results.some((r) => r.status === "success")) {
    h.updateLastInteractionTimeForConversation(zid, uid);
  }
  return { results, pid };
}

export function makeHandlePostCommentsBulk(h: Helpers) {
  return async function handle_POST_comments_bulk(
    req: { p: { zid: any; uid?: any; pid?: any }; body: { csv?: any } },
    res: any
  ) {
    const { zid, uid } = req.p;
    const csv = req.body && req.body.csv;
    if (!csv) {
      fail(res, 400, "polis_err_param_missing_csv");
      return;
    }
    try {
      // Refuse a non-moderator before a participant row is created.
      if (!(await h.isModerator(zid, uid))) {
        fail(res, 403, "polis_err_post_comment_auth");
        return;
      }
      let texts: string[] | null;
      try {
        texts = parseSeedCsv(String(csv));
      } catch (parseErr) {
        // Not a CSV at all (unbalanced quotes, ragged rows): the client's fault.
        fail(res, 400, "polis_err_csv_malformed");
        return;
      }
      if (!texts) {
        fail(res, 400, "polis_err_csv_header");
        return;
      }

      const { results, pid } = await insertSeedComments(h, zid, uid, texts, req.p.pid);
      res.json({ results, currentPid: pid });
    } catch (err) {
      fail(res, 500, "polis_err_post_comments_bulk", err);
    }
  };
}
