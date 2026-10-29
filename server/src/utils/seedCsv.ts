// SPDX-FileCopyrightText: 2012-present The Polis Authors
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// Ported from compdemocracy/polis 2.42.2 (server/src/utils/seedCsv.ts) and
// extended to read the statements.csv that Citizens exports.

import { parse } from "csv-parse/sync";

// Excel and other spreadsheets often end every row with a comma, which reads
// as one more column whose name is empty.
const UNNAMED = "";

// The accepted first rows, without an optional trailing unnamed column:
// upstream Polis's `comment_text` (optionally with `original_id`, which this
// schema has no column for and is ignored), and Citizens' `position,statement`
// or a bare `statement`. Column order does not matter.
const HEADERS: Array<{ text: string; columns: string[] }> = [
  { text: "comment_text", columns: ["comment_text"] },
  { text: "comment_text", columns: ["comment_text", "original_id"] },
  { text: "statement", columns: ["statement"] },
  { text: "statement", columns: ["position", "statement"] },
];

function textColumn(header: string[]): string | null {
  const named =
    header[header.length - 1] === UNNAMED ? header.slice(0, -1) : header;
  const names = named.map((name) => name.trim().toLowerCase());
  const match = HEADERS.find(
    (h) =>
      h.columns.length === names.length &&
      h.columns.every((column) => names.includes(column))
  );
  return match ? match.text : null;
}

// Returns the statement texts of a seed CSV in file order, or in `position`
// order when the file has that column. Returns null when the first row is not
// an accepted header or a row has a value in the unnamed column. Any other
// malformed CSV throws the parser's error.
export function parseSeedCsv(csv: string): string[] | null {
  const refused = new Error("Invalid seed CSV header");
  let text: string | null = null;
  try {
    const records: Array<Record<string, string>> = parse(csv, {
      bom: true,
      columns: (header: string[]) => {
        text = textColumn(header);
        if (!text) throw refused;
        return header.map((name) => name.trim().toLowerCase());
      },
      on_record: (record: Record<string, string>) => {
        if (Object.prototype.hasOwnProperty.call(record, UNNAMED)) {
          if (record[UNNAMED] !== "") throw refused;
          delete record[UNNAMED];
        }
        return record;
      },
      skip_empty_lines: true,
    });
    if (!text) return null;
    const column: string = text;
    const rows = records.map((record, index) => ({
      txt: record[column],
      order: Number.parseFloat(record.position ?? ""),
      index,
    }));
    if (rows.every((row) => Number.isFinite(row.order))) {
      rows.sort((a, b) => a.order - b.order || a.index - b.index);
    }
    return rows.map((row) => row.txt);
  } catch (err) {
    if (err === refused) return null;
    throw err;
  }
}
