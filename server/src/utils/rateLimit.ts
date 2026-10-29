// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// Per-key budget of events in a sliding window, kept in memory (a restart
// resets it). Used by the AI drafting and the Citizens import routes.

export function makeBudget(limit: number, windowMs: number) {
  const recent: { [key: string]: number[] } = {};
  return function overBudget(key: any): boolean {
    const now = Date.now();
    const k = String(key);
    const stamps = (recent[k] || []).filter((t) => now - t < windowMs);
    if (stamps.length >= limit) {
      recent[k] = stamps;
      return true;
    }
    stamps.push(now);
    recent[k] = stamps;
    return false;
  };
}
