// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// The first section: the few numbers and statements that matter most, each
// a link to the section with the detail. Computed from the same data the
// sections use (consensus from the maths, extremity, uncertainty list).

import React from "react";
import _ from "lodash";
import { goToSection } from "./framework/header";
import { t, fmt } from "../strings";

const pct = (n, s) => (s ? ((n / s) * 100) << 0 : 0);

const Summary = ({ math, comments, consensus, extremity, uncertainty, ptptCount, ptptCountTotal }) => {
  const byTid = _.keyBy(comments, "tid");
  const groups = _.size(math["group-votes"]);
  // the maths' consensus entries carry p-success (share of voters) and
  // n-trials (how many voted); use them, and skip statements few people saw
  const pick = (list, kind) =>
    (list || []).map((c) => {
      const k = byTid[c.tid];
      if (!k) return null;
      const n = Number(c["n-trials"]) || 0;
      const p = typeof c["p-success"] === "number" ? Math.round(c["p-success"] * 100) : kind === "agree" ? pct(k.agreed, k.saw) : pct(k.disagreed, k.saw);
      return { tid: c.tid, txt: k.txt, kind, p, n };
    });
  const minVotes = Math.max(3, Math.floor((ptptCount || 0) * 0.3));
  const top = pick(consensus && consensus.agree, "agree")
    .concat(pick(consensus && consensus.disagree, "disagree"))
    .filter((c) => c && c.n >= minVotes)
    .sort((a, b) => b.p - a.p || b.n - a.n)
    .slice(0, 3);
  let divisive = null;
  _.each(extremity, (e, tid) => {
    if (byTid[tid] && (!divisive || e > divisive.e)) divisive = { tid: Number(tid), e, txt: byTid[tid].txt };
  });
  const uncertain = (uncertainty || []).length;

  const line = (key, to, txt, meta) => (
    <li key={key}>
      <a
        href={"#" + to}
        onClick={(e) => {
          e.preventDefault();
          goToSection(to);
        }}>
        <span className="sum__meta">{meta}</span>
        <span className="sum__txt">{txt}</span>
      </a>
    </li>
  );

  return (
    <section className="sec sec--summary" id="summary">
      <h2>{t("summary")}</h2>
      <p className="lead">{fmt("summaryIntro", { n: ptptCountTotal, g: ptptCount, k: groups })}</p>
      <ul className="sum">
        {top.map((s) => line("c" + s.tid, "majority", s.txt, fmt(s.kind === "agree" ? "sumAgreed" : "sumDisagreed", { p: s.p })))}
        {divisive ? line("d", "divisive", divisive.txt, t("sumDivisive")) : null}
        {line("g", "groups", fmt("sumGroups", { k: groups }), t("sumGroupsMeta"))}
        {uncertain ? line("u", "uncertainty", fmt("sumUncertain", { n: uncertain }), t("sumUncertainMeta")) : null}
      </ul>
    </section>
  );
};

export default Summary;
