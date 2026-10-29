// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only

import {
  buildMessages,
  parseStatements,
  providerInfo,
  providerLabel,
  statementKey,
  wantsJsonMode,
} from "../src/utils/aiDraft";

describe("parseStatements", () => {
  const count = 5;

  it("reads a plain JSON object", () => {
    const out = parseStatements('{"statements": ["A should happen.", "B must not."]}', { count });
    expect(out).toEqual(["A should happen.", "B must not."]);
  });

  it("strips code fences and surrounding prose", () => {
    const answer = 'Here you go:\n```json\n{"statements": ["One idea."]}\n```\nHope this helps.';
    expect(parseStatements(answer, { count })).toEqual(["One idea."]);
  });

  it("drops duplicates, also against kept statements, ignoring case and final stop", () => {
    const answer = '{"statements": ["Buses should run later.", "buses should run later", "Taxes are too high."]}';
    expect(parseStatements(answer, { count, kept: ["TAXES ARE TOO HIGH"] })).toEqual([
      "Buses should run later.",
    ]);
  });

  it("drops empty and over-long statements and caps at count", () => {
    const long = "x".repeat(401);
    const answer = JSON.stringify({ statements: ["", "  ", long, "a", "b", "c", "d"] });
    expect(parseStatements(answer, { count: 3 })).toEqual(["a", "b", "c"]);
  });

  it("collapses whitespace", () => {
    expect(parseStatements('{"statements": ["  two   words \\n here "]}', { count })).toEqual([
      "two words here",
    ]);
  });

  it("throws on a refusal without JSON", () => {
    expect(() => parseStatements("I cannot help with that request.", { count })).toThrow();
  });

  it("throws when the object has no statements array", () => {
    expect(() => parseStatements('{"items": []}', { count })).toThrow();
  });
});

describe("buildMessages", () => {
  it("names the language, the count, the kept statements and the instruction", () => {
    const [system, user] = buildMessages({
      topic: "Transport",
      description: "d",
      request: "statements about buses",
      count: 7,
      language: "it",
      kept: ["Buses should be free."],
      instruction: "shorter",
    });
    expect(system.role).toBe("system");
    expect(system.content).toContain("Write everything in Italian.");
    expect(system.content).toContain("* Buses should be free.");
    expect(system.content).toContain("Apply this instruction to the new statements: shorter");
    expect(system.content).toContain('the conversation is titled "Transport" and described as: d');
    expect(system.content).toContain("even when the title is about something else");
    expect(user.content.indexOf("Subject of the statements: statements about buses")).toBe(0);
    expect(user.content).toContain("Write exactly 7 statements about this subject.");
    expect(user.content).not.toContain("Transport");
  });

  it("falls back to the language of the request and omits an empty description", () => {
    const [system, user] = buildMessages({ topic: "T", description: "", request: "r", count: 3 });
    expect(system.content).toContain("language of the request");
    expect(system.content).toContain('titled "T".');
    expect(system.content).not.toContain("described as");
    expect(user.content).not.toContain("Conversation");
  });
});

describe("providerLabel and wantsJsonMode", () => {
  it("labels known hosts, local hosts and others", () => {
    expect(providerLabel("https://api.mistral.ai/v1")).toBe("Mistral AI");
    expect(providerLabel("http://host.docker.internal:11434/v1")).toBe("a self-hosted model");
    expect(providerLabel("https://llm.example.org/v1")).toBe("llm.example.org");
    expect(providerLabel("not a url")).toBe("the configured AI provider");
  });

  it("knows region and privacy policy of the usual providers", () => {
    expect(providerInfo("https://api.mistral.ai/v1")).toEqual({
      label: "Mistral AI",
      region: "the European Union",
      privacyUrl: "https://mistral.ai/terms/#privacy-policy",
    });
    expect(providerInfo("https://ollama.com/v1").label).toBe("Ollama Cloud");
    expect(providerInfo("http://localhost:11434/v1").region).toBe("this server");
    expect(providerInfo("https://llm.example.org/v1")).toEqual({ label: "llm.example.org", region: "", privacyUrl: "" });
  });

  it("sends JSON mode only to hosts known to accept it unless forced", () => {
    expect(wantsJsonMode("https://api.mistral.ai/v1", "auto")).toBe(true);
    expect(wantsJsonMode("https://ollama.com/v1", "auto")).toBe(false);
    expect(wantsJsonMode("https://ollama.com/v1", "on")).toBe(true);
    expect(wantsJsonMode("https://api.openai.com/v1", "off")).toBe(false);
  });

  it("statementKey ignores case, spacing and a final stop", () => {
    expect(statementKey("  Buses  should run later. ")).toBe(statementKey("buses should run later"));
  });
});
