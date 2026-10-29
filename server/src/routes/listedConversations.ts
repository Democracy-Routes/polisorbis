// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// GET /api/v3/listed-conversations: the open conversations an organizer
// chose to show on the home page (conversations.is_listed). Public, no
// login, cached for 30 seconds. Outside server.ts because that module
// shadows Promise with bluebird.

import fail from "../utils/fail";
import logger from "../utils/logger";

const CACHE_MS = 30 * 1000;
const DESCRIPTION_MAX = 300;

type Helpers = {
  pgQueryP_readOnly: (query: string, params: any[]) => PromiseLike<any>;
};

export function makeHandleGetListedConversations(h: Helpers) {
  let cache: { at: number; body: any } | null = null;
  return async function handle_GET_listed_conversations(req: any, res: any) {
    try {
      if (cache && Date.now() - cache.at < CACHE_MS) {
        res.json(cache.body);
        return;
      }
      const rows = await h.pgQueryP_readOnly(
        "select z.zinvite, c.topic, c.description, c.participant_count, c.created, " +
          "(select r.report_id from reports r where r.zid = c.zid order by r.rid asc limit 1) as report_id " +
          "from conversations c join zinvites z on z.zid = c.zid " +
          "where c.is_listed = true and c.is_active = true and c.is_draft = false " +
          "order by c.created desc limit 50;",
        []
      );
      const conversations = (rows || []).map((r: any) => ({
        conversation_id: r.zinvite,
        topic: r.topic || "",
        description: String(r.description || "").slice(0, DESCRIPTION_MAX),
        participant_count: Number(r.participant_count) || 0,
        created: Number(r.created),
        report_id: r.report_id || null,
      }));
      cache = { at: Date.now(), body: { conversations } };
      res.json(cache.body);
    } catch (err) {
      logger.error("polis_err_listed_conversations", err);
      fail(res, 500, "polis_err_listed_conversations");
    }
  };
}
