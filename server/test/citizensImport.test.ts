// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only

import {
  MAX_STATEMENTS,
  contextFor,
  findPersonalData,
  findPersonalDataIn,
  validateImport,
} from "../src/utils/citizensImport";

const good = () => ({
  schema: "citizens.statement-seeds/1",
  assembly: { name: "Assemblea sul centro storico", language: "it" },
  exported_at: "2026-10-29T10:00:00Z",
  statements: [
    { position: 2, statement: "Il centro dovrebbe essere chiuso alle auto nei fine settimana." },
    { position: 1, statement: "Servono più parcheggi di scambio fuori dal centro." },
  ],
});

describe("validateImport", () => {
  it("accepts a Citizens export and derives topic, context and order", () => {
    const v = validateImport(good());
    expect(v.ok).toBe(true);
    if (!v.ok) return;
    expect(v.request.topic).toBe("Assemblea sul centro storico");
    expect(v.request.description).toBe("");
    expect(v.request.language).toBe("it");
    expect(v.request.context).toBe("citizens:Assemblea sul centro storico");
    expect(v.request.reuse).toBe(true);
    expect(v.request.strictModeration).toBe(false);
    expect(v.request.statements.map((s) => s.position)).toEqual([1, 2]);
  });

  it("takes topic, description and flags from the body when given", () => {
    const v = validateImport({ ...good(), topic: " Centro storico ", description: "Dal 12 ottobre", strict_moderation: true, reuse: false });
    expect(v.ok).toBe(true);
    if (!v.ok) return;
    expect(v.request.topic).toBe("Centro storico");
    expect(v.request.description).toBe("Dal 12 ottobre");
    expect(v.request.strictModeration).toBe(true);
    expect(v.request.reuse).toBe(false);
  });

  it("rejects a wrong schema", () => {
    const v = validateImport({ ...good(), schema: "citizens.statement-seeds/2" });
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.errors.map((e) => e.field)).toEqual(["schema"]);
  });

  it("rejects a missing assembly name, an empty list and a non-object", () => {
    expect(validateImport({ ...good(), assembly: {} }).ok).toBe(false);
    expect(validateImport({ ...good(), statements: [] }).ok).toBe(false);
    expect(validateImport("nope").ok).toBe(false);
    expect(validateImport(null).ok).toBe(false);
  });

  it("rejects more than the maximum number of statements", () => {
    const statements = [];
    for (let i = 0; i < MAX_STATEMENTS + 1; i++) statements.push({ position: i + 1, statement: "S " + i });
    const v = validateImport({ ...good(), statements });
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.errors[0].field).toBe("statements");
  });

  it("rejects a statement over 400 characters and names its index", () => {
    const long = new Array(402).join("x");
    const v = validateImport({ ...good(), statements: [{ position: 1, statement: "ok" }, { position: 2, statement: long }] });
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.errors).toEqual([{ field: "statements[1]", reason: "statement longer than 400 characters" }]);
  });

  it("rejects an empty statement", () => {
    const v = validateImport({ ...good(), statements: [{ position: 1, statement: "   " }] });
    expect(v.ok).toBe(false);
  });

  it("ignores an unknown language", () => {
    const v = validateImport({ ...good(), assembly: { name: "A", language: "xx" } });
    expect(v.ok).toBe(true);
    if (!v.ok) return;
    expect(v.request.language).toBe(null);
  });
});

describe("contextFor", () => {
  it("normalises whitespace and keeps within the column", () => {
    expect(contextFor("  Assemblea   sul\ncentro ")).toBe("citizens:Assemblea sul centro");
    expect(contextFor(new Array(2000).join("a")).length).toBe(990);
  });
});

describe("findPersonalData", () => {
  it("lets ordinary statements through", () => {
    expect(findPersonalData("Il centro dovrebbe essere chiuso alle auto nei fine settimana.")).toBe(null);
    expect(findPersonalData("The council should spend 20% of the 2027 budget on cycle lanes.")).toBe(null);
    expect(findPersonalData("Set a table of fees for parking: 3 euro per hour.")).toBe(null);
    expect(findPersonalData("Say \"no\" to the new bypass.")).toBe(null);
  });

  it("catches e-mail addresses", () => {
    expect(findPersonalData("Write to mario.rossi@example.org for the plan")).toMatch(/e-mail/);
  });

  it("catches phone numbers", () => {
    expect(findPersonalData("Call 0039 333 123 4567 to join")).toMatch(/phone/);
    expect(findPersonalData("Call +41 79 123 45 67")).toMatch(/phone/);
  });

  it("catches table references in five languages", () => {
    expect(findPersonalData("Tavolo 3 ha proposto di chiudere il centro")).toMatch(/table/);
    expect(findPersonalData("As table 12 said, the bypass is needed")).toMatch(/table/);
    expect(findPersonalData("Tisch 2 schlägt vor")).toMatch(/table/);
    expect(findPersonalData("La mesa n. 4 propone")).toMatch(/table/);
    expect(findPersonalData("Table no. 7 wants more trees")).toMatch(/table/);
  });

  it("catches a verbatim quote", () => {
    expect(findPersonalData("\"We never wanted the bypass in the first place\"")).toMatch(/quote/);
    expect(findPersonalData("«Il centro è nostro»")).toMatch(/quote/);
  });

  it("reports positions for a list", () => {
    const hits = findPersonalDataIn([
      { position: 1, statement: "Fine" },
      { position: 2, statement: "tavolo 5 dice no" },
    ]);
    expect(hits).toEqual([{ position: 2, reason: "refers to a table number" }]);
  });
});
