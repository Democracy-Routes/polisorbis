// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// Pure helpers for POST /api/v3/citizens/import: validation of the Citizens
// statement-seeds export (schema citizens.statement-seeds/1, see
// docs/citizens-integration.md in the Citizens-Polis repository) and the
// personal-data guard the brief requires on this side too.

export const SCHEMA = "citizens.statement-seeds/1";
export const MAX_STATEMENTS = 200;
export const MAX_STATEMENT_LENGTH = 400;
export const MAX_TOPIC_LENGTH = 1000;
export const MAX_DESCRIPTION_LENGTH = 50000;
export const CONTEXT_PREFIX = "citizens:";
const LANGUAGES = ["en", "it", "de", "fr", "es"];

export type ImportRequest = {
  topic: string;
  description: string;
  language: string | null;
  context: string;
  strictModeration: boolean;
  reuse: boolean;
  statements: Array<{ position: number; statement: string }>;
};

export type ValidationError = { field: string; reason: string };

export type Validation =
  | { ok: true; request: ImportRequest }
  | { ok: false; errors: ValidationError[] };

function isObject(x: any): x is Record<string, any> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

function optionalBool(x: any, fallback: boolean): boolean | null {
  if (x === undefined || x === null) return fallback;
  if (typeof x === "boolean") return x;
  if (x === "true") return true;
  if (x === "false") return false;
  return null;
}

/** The idempotency key stored in conversations.context (varchar 999). */
export function contextFor(assemblyName: string): string {
  return (CONTEXT_PREFIX + assemblyName.trim().replace(/\s+/g, " ")).slice(0, 990);
}

export function validateImport(body: any): Validation {
  const errors: ValidationError[] = [];
  if (!isObject(body)) {
    return { ok: false, errors: [{ field: "body", reason: "not a JSON object" }] };
  }
  if (body.schema !== SCHEMA) {
    errors.push({ field: "schema", reason: "expected " + SCHEMA });
  }
  const assembly = isObject(body.assembly) ? body.assembly : {};
  const name = typeof assembly.name === "string" ? assembly.name.trim() : "";
  if (!name || name.length > MAX_TOPIC_LENGTH) {
    errors.push({ field: "assembly.name", reason: "required, 1-" + MAX_TOPIC_LENGTH + " characters" });
  }
  let language: string | null = null;
  if (typeof assembly.language === "string" && LANGUAGES.indexOf(assembly.language.toLowerCase()) >= 0) {
    language = assembly.language.toLowerCase();
  }

  let topic = name;
  if (body.topic !== undefined && body.topic !== null) {
    if (typeof body.topic !== "string" || !body.topic.trim() || body.topic.trim().length > MAX_TOPIC_LENGTH) {
      errors.push({ field: "topic", reason: "a string of 1-" + MAX_TOPIC_LENGTH + " characters" });
    } else {
      topic = body.topic.trim();
    }
  }
  let description = "";
  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== "string" || body.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push({ field: "description", reason: "a string of up to " + MAX_DESCRIPTION_LENGTH + " characters" });
    } else {
      description = body.description.trim();
    }
  }
  const strictModeration = optionalBool(body.strict_moderation, false);
  if (strictModeration === null) errors.push({ field: "strict_moderation", reason: "true or false" });
  const reuse = optionalBool(body.reuse, true);
  if (reuse === null) errors.push({ field: "reuse", reason: "true or false" });

  const statements: Array<{ position: number; statement: string }> = [];
  if (!Array.isArray(body.statements) || body.statements.length === 0) {
    errors.push({ field: "statements", reason: "a non-empty array" });
  } else if (body.statements.length > MAX_STATEMENTS) {
    errors.push({ field: "statements", reason: "at most " + MAX_STATEMENTS + " statements" });
  } else {
    body.statements.forEach((row: any, i: number) => {
      const field = "statements[" + i + "]";
      const text = isObject(row) && typeof row.statement === "string" ? row.statement.trim() : "";
      if (!text) {
        errors.push({ field, reason: "statement is required" });
        return;
      }
      if (text.length > MAX_STATEMENT_LENGTH) {
        errors.push({ field, reason: "statement longer than " + MAX_STATEMENT_LENGTH + " characters" });
        return;
      }
      const position =
        isObject(row) && isFinite(Number(row.position)) && row.position !== "" && row.position !== null ? Number(row.position) : i + 1;
      statements.push({ position, statement: text });
    });
    // Keep the export's order when every row has a position; ties keep file order.
    statements.sort((a, b) => a.position - b.position || 0);
  }

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    request: {
      topic,
      description,
      language,
      context: contextFor(name),
      strictModeration: strictModeration as boolean,
      reuse: reuse as boolean,
      statements,
    },
  };
}

// --- personal-data guard ----------------------------------------------------
//
// Citizens strips names, table numbers and quotes before export; this is the
// second line. It is deliberately simple and errs on the side of refusing:
// an organizer can rephrase a statement, a leaked phone number cannot be
// recalled.

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
// 8 or more digits, optionally separated by spaces, dots, dashes or slashes,
// optionally starting with + or (0..). Years and small counts have fewer digits.
const PHONE = /(?:\+|\(?0)?\d(?:[\s./-]?\d){7,}/;
const TABLE = /\b(table|tavolo|tisch|mesa)\s*(n[°º.]?\s*|no\.?\s*|#\s*)?\d+\b/i;
const QUOTED = /^\s*["“«‘'][\s\S]+["”»’']\s*$/;

export function findPersonalData(text: string): string | null {
  if (EMAIL.test(text)) return "contains an e-mail address";
  if (PHONE.test(text)) return "contains a phone number";
  if (TABLE.test(text)) return "refers to a table number";
  if (QUOTED.test(text)) return "is a verbatim quote";
  return null;
}

export function findPersonalDataIn(
  statements: Array<{ position: number; statement: string }>
): Array<{ position: number; reason: string }> {
  const hits: Array<{ position: number; reason: string }> = [];
  statements.forEach((s) => {
    const reason = findPersonalData(s.statement);
    if (reason) hits.push({ position: s.position, reason });
  });
  return hits;
}
