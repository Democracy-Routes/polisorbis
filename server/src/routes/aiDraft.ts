// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// GET /api/v3/ai/status and POST /api/v3/ai/draft-statements: a moderator
// asks an OpenAI-compatible chat model for seed statements and gets a list
// back. Nothing is stored; the admin page shows the list for review and adds
// the approved ones through POST /api/v3/comments-bulk. Off unless
// AI_PROVIDER_BASE_URL and AI_MODEL are set. Lives outside server.ts because
// that module shadows Promise with bluebird (see routes/commentsBulk.ts).

import fail from "../utils/fail";
import logger from "../utils/logger";
import {
  buildMessages,
  correctionMessage,
  parseStatements,
  providerLabel,
  wantsJsonMode,
  ChatMessage,
  STATEMENT_MAX_LENGTH,
} from "../utils/aiDraft";

export type AiConfig = {
  baseUrl: string | null;
  apiKey: string | null;
  model: string | null;
  providerName: string | null;
  jsonMode: string; // auto | on | off
};

type Helpers = {
  isModerator: (zid: any, uid?: any) => PromiseLike<any>;
  getConversationInfo: (zid: any) => PromiseLike<any>;
  config: AiConfig;
};

const TIMEOUT_MS = 60000;
const MAX_TOKENS = 4000;
const KEPT_MAX_ITEMS = 60;

// Per-user budget: generations per hour. Kept in memory; a restart resets it.
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const recent: { [uid: string]: number[] } = {};

function overBudget(uid: any): boolean {
  const now = Date.now();
  const stamps = (recent[uid] || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (stamps.length >= RATE_LIMIT) {
    recent[uid] = stamps;
    return true;
  }
  stamps.push(now);
  recent[uid] = stamps;
  return false;
}

export function aiEnabled(c: AiConfig): boolean {
  return Boolean(c.baseUrl && c.model);
}

export function aiProviderName(c: AiConfig): string {
  return c.providerName || providerLabel(c.baseUrl || "");
}

// Provider failures carry a flag instead of a subclass: with the ES5 build
// target `instanceof` does not work on extended Errors.
type UpstreamError = Error & { upstream: true; status: number };

function upstreamError(message: string, status: number): UpstreamError {
  const err = new Error(message) as UpstreamError;
  err.upstream = true;
  err.status = status;
  return err;
}

// One chat completion. Logs never include the key or the messages.
async function chat(c: AiConfig, messages: ChatMessage[]): Promise<string> {
  const url = (c.baseUrl || "").replace(/\/+$/, "") + "/chat/completions";
  const body: any = {
    model: c.model,
    messages,
    temperature: 0.2,
    max_tokens: MAX_TOKENS,
  };
  if (wantsJsonMode(c.baseUrl || "", c.jsonMode)) {
    body.response_format = { type: "json_object" };
  }
  const headers: { [name: string]: string } = { "Content-Type": "application/json" };
  if (c.apiKey) headers.Authorization = "Bearer " + c.apiKey;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err: any) {
    throw upstreamError(
      err && err.name === "AbortError" ? "timeout after " + TIMEOUT_MS + "ms" : "network error",
      0
    );
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.text()).slice(0, 300);
    } catch (e) {
      // no body
    }
    throw upstreamError("HTTP " + res.status + " " + detail, res.status);
  }
  const data: any = await res.json();
  const content =
    data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : null;
  if (typeof content !== "string") {
    throw upstreamError("unexpected response shape", res.status);
  }
  return content;
}

export function makeHandleGetAiStatus(c: AiConfig) {
  return function handle_GET_ai_status(req: any, res: any) {
    res.json({ enabled: aiEnabled(c), provider: aiEnabled(c) ? aiProviderName(c) : null });
  };
}

export function makeHandlePostAiDraftStatements(h: Helpers) {
  return async function handle_POST_ai_draft_statements(
    req: {
      p: { zid: any; uid?: any; request: string; count?: number; language?: string; instruction?: string };
      body: { kept?: any };
    },
    res: any
  ) {
    const c = h.config;
    if (!aiEnabled(c)) {
      fail(res, 404, "polis_err_ai_not_configured");
      return;
    }
    const { zid, uid } = req.p;
    try {
      if (!(await h.isModerator(zid, uid))) {
        fail(res, 403, "polis_err_post_comment_auth");
        return;
      }
      if (overBudget(uid)) {
        fail(res, 429, "polis_err_ai_rate_limited");
        return;
      }
      const kept: string[] = Array.isArray(req.body && req.body.kept)
        ? req.body.kept
            .filter((s: any) => typeof s === "string" && s.trim())
            .slice(0, KEPT_MAX_ITEMS)
            .map((s: string) => s.trim().slice(0, STATEMENT_MAX_LENGTH))
        : [];
      const conv: any = await h.getConversationInfo(zid);
      const count = req.p.count || 10;
      const messages = buildMessages({
        topic: (conv && conv.topic) || "",
        description: (conv && conv.description) || "",
        request: req.p.request,
        count,
        language: req.p.language,
        kept,
        instruction: req.p.instruction,
      });

      let statements: string[];
      let answer = await chat(c, messages);
      try {
        statements = parseStatements(answer, { count, kept });
      } catch (firstErr: any) {
        // One correction round-trip, then give up.
        const retry: ChatMessage[] = messages.concat([
          { role: "assistant", content: answer.slice(0, 8000) },
          { role: "user", content: correctionMessage(String(firstErr.message || firstErr)) },
        ]);
        answer = await chat(c, retry);
        try {
          statements = parseStatements(answer, { count, kept });
        } catch (secondErr: any) {
          logger.warn("polis_err_ai_bad_response", { reason: String(secondErr.message || secondErr) });
          fail(res, 502, "polis_err_ai_bad_response");
          return;
        }
      }
      logger.info("ai_draft_statements", { zid, uid, count: statements.length });
      res.json({ statements, provider: aiProviderName(c) });
    } catch (err: any) {
      if (err && err.upstream) {
        logger.error("polis_err_ai_upstream", { status: err.status, message: err.message });
        fail(res, 502, "polis_err_ai_upstream");
        return;
      }
      fail(res, 500, "polis_err_ai_draft", err);
    }
  };
}
