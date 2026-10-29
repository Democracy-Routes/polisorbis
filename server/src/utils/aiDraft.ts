// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// Pure helpers for POST /api/v3/ai/draft-statements: the prompt sent to the
// model and the parsing of its answer. No I/O here, so test/aiDraft.test.ts
// covers them without a database or a provider. The statement rules are the
// ones Citizens uses for its Polis seeds (citizens/services/seeds.py).

export type DraftInput = {
  topic: string;
  description: string;
  request: string;
  count: number;
  language?: string; // en, it, de, fr, es; anything else = language of the request
  kept?: string[]; // statements already in the organizer's list
  instruction?: string; // refinement, applied to the new statements
};

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const LANGUAGE_NAMES: { [code: string]: string } = {
  en: "English",
  it: "Italian",
  de: "German",
  fr: "French",
  es: "Spanish",
};

export const STATEMENT_MAX_LENGTH = 400; // what the admin page accepts
export const STATEMENT_SOFT_LENGTH = 140; // what the prompt asks for

function languageRule(code?: string): string {
  const name = code ? LANGUAGE_NAMES[code.toLowerCase()] : undefined;
  return name
    ? "- Write everything in " + name + "."
    : "- Write everything in the language of the request.";
}

export function buildMessages(input: DraftInput): ChatMessage[] {
  const kept = (input.kept || []).filter((s) => s && s.trim());
  const rules = [
    "You draft seed statements for a Polis conversation, where members of the",
    "public vote agree, disagree or pass on each statement.",
    "",
    "Rules:",
    '- Respond with ONLY a JSON object: {"statements": ["...", "..."]}',
    "- A statement is ONE idea, one sentence, in a neutral declarative voice,",
    '  that a stranger can agree or disagree with: "Evening buses should run',
    '  until midnight", not "People want later buses".',
    "- Keep each statement under " + STATEMENT_SOFT_LENGTH + " characters.",
    '- Write for the public: no "we", no names of people, no quotations.',
    "- Cover a range of perspectives, including positions for and against,",
    "  not one side only.",
    "- Do not repeat the same idea in two statements.",
    languageRule(input.language),
  ];
  if (kept.length) {
    rules.push(
      "- These statements are already in the list. Do not repeat their ideas:"
    );
    kept.forEach((s) => rules.push("  * " + s.trim()));
  }
  if (input.instruction && input.instruction.trim()) {
    rules.push("- Apply this instruction to the new statements: " + input.instruction.trim());
  }

  const description = (input.description || "").trim().slice(0, 1200);
  const user = [
    "Conversation topic: " + (input.topic || "").trim(),
    description ? "Conversation description: " + description : "",
    "Request: " + input.request.trim(),
    "Write exactly " + input.count + " statements.",
  ]
    .filter((line) => line)
    .join("\n");

  return [
    { role: "system", content: rules.join("\n") },
    { role: "user", content: user },
  ];
}

// The user message of the correction round-trip after an unusable answer
// (same wording as Citizens).
export function correctionMessage(error: string): string {
  return (
    "Your previous answer was not valid. Validation error: " +
    error.slice(0, 800) +
    "\nRespond again with ONLY a valid JSON object matching the required schema" +
    " — no prose, no code fences, no explanations."
  );
}

// Two statements are the same idea if they differ only in case, spacing or
// a final full stop or exclamation mark.
export function statementKey(txt: string): string {
  return txt.replace(/\s+/g, " ").trim().toLowerCase().replace(/[.!]+$/, "");
}

function extractJson(content: string): any {
  let text = (content || "").trim();
  if (text.indexOf("```") === 0) {
    const parts = text.split("```");
    text = parts.length > 1 ? parts[1] : "";
    if (text.indexOf("json") === 0) text = text.slice(4);
    text = text.trim();
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object in the answer");
  return JSON.parse(text.slice(start, end + 1));
}

// The statements of a model answer: cleaned, deduplicated (also against
// `kept`), without empty or over-long ones, at most `count`. Throws when the
// answer holds no JSON object or no `statements` array.
export function parseStatements(
  content: string,
  opts: { count: number; kept?: string[]; maxLen?: number }
): string[] {
  const data = extractJson(content);
  if (!data || !Array.isArray(data.statements)) {
    throw new Error('The JSON object has no "statements" array');
  }
  const maxLen = opts.maxLen || STATEMENT_MAX_LENGTH;
  const seen: { [key: string]: boolean } = {};
  (opts.kept || []).forEach((s) => {
    if (typeof s === "string") seen[statementKey(s)] = true;
  });
  const out: string[] = [];
  for (const raw of data.statements) {
    if (out.length >= opts.count) break;
    if (typeof raw !== "string") continue;
    const txt = raw.replace(/\s+/g, " ").trim();
    if (!txt || txt.length > maxLen) continue;
    const key = statementKey(txt);
    if (seen[key]) continue;
    seen[key] = true;
    out.push(txt);
  }
  return out;
}

// A readable provider name from the base URL, for the admin page and the
// privacy notice. AI_PROVIDER_NAME overrides it.
export function providerLabel(baseUrl: string): string {
  let host = "";
  try {
    host = new URL(baseUrl).hostname.toLowerCase();
  } catch (e) {
    return "the configured AI provider";
  }
  const known: { [host: string]: string } = {
    "api.mistral.ai": "Mistral AI",
    "api.openai.com": "OpenAI",
    "api.anthropic.com": "Anthropic",
    "generativelanguage.googleapis.com": "Google",
    "ollama.com": "Ollama Cloud",
    "api.groq.com": "Groq",
    "openrouter.ai": "OpenRouter",
  };
  if (known[host]) return known[host];
  if (
    host === "localhost" ||
    host.indexOf("127.") === 0 ||
    host.indexOf("10.") === 0 ||
    host.indexOf("192.168.") === 0 ||
    host.indexOf("host.docker.internal") === 0 ||
    host.indexOf(".") < 0
  ) {
    return "a self-hosted model";
  }
  return host;
}

// Whether to send response_format json_object: only to hosts known to accept
// it, unless AI_JSON_MODE forces it on or off.
export function wantsJsonMode(baseUrl: string, mode?: string): boolean {
  if (mode === "on") return true;
  if (mode === "off") return false;
  try {
    const host = new URL(baseUrl).hostname.toLowerCase();
    return host === "api.mistral.ai" || host === "api.openai.com";
  } catch (e) {
    return false;
  }
}
