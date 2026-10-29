// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
//
// The statement list used by every section: one row per statement, one
// stacked bar per column ("All" + each opinion group). On phones the columns
// stack under the text; from 48rem the list is a grid with a header row
// (report.css .sl). The numbers are the ones BarChartCompact showed: bar
// widths are count / members of the column, percentages are count / saw.

import React from "react";
import _ from "lodash";
import * as globals from "../globals";
import { t, fmt } from "../../strings";

export function groupLabel(groupNames, gid) {
  const custom = groupNames && groupNames[gid];
  return custom ? custom : fmt("groupDefault", { letter: globals.groupLabels[gid] });
}

const Bar = ({ voteCounts, nMembers }) => {
  if (typeof voteCounts === "undefined") {
    return <div className="pcts">{t("missingCounts")}</div>;
  }
  const agrees = voteCounts.A;
  const disagrees = voteCounts.D;
  const saw = voteCounts.S;
  const passes = saw - (agrees + disagrees);
  const w = (n) => (nMembers ? (n / nMembers) * 100 : 0);
  const pct = (n) => (saw ? ((n / saw) * 100) << 0 : 0);
  const a = pct(agrees);
  const d = pct(disagrees);
  const p = pct(passes);
  const seen = nMembers ? ((saw / nMembers) * 100) << 0 : 0;
  return (
    <div title={fmt("barTitle", { a, d, p, s: saw, seen, n: nMembers })}>
      <div className="bar" aria-hidden="true">
        <i className="a" style={{ width: w(agrees) + "%" }} />
        <i className="d" style={{ width: w(disagrees) + "%" }} />
        <i className="p" style={{ width: w(passes) + "%" }} />
      </div>
      <div className="pcts">
        {`${a}% ${d}% ${p}% (${saw})`}
      </div>
    </div>
  );
};

const Row = ({ comment, groups, groupNames, ptptCount }) => {
  if (!comment) return null;
  let totalMembers = 0;
  const cols = [];
  _.forEach(groups, (g, i) => {
    totalMembers += g["n-members"];
    cols.push({ key: i, name: groupLabel(groupNames, Number(i)), votes: g.votes[comment.tid], n: g["n-members"] });
  });
  cols.unshift({
    key: "all",
    name: t("colAll"),
    votes: { A: comment.agreed, D: comment.disagreed, S: comment.saw },
    n: totalMembers,
  });
  return (
    <div className="srow">
      <div className="srow__text">
        <span className="tid">{comment.tid}</span>
        <span className="srow__txt">{comment.txt}</span>
      </div>
      <div className="srow__cols">
        {cols.map((c) => (
          <div className="col" key={c.key}>
            <span className="col__name">{c.name}</span>
            <Bar voteCounts={c.votes} nMembers={c.n} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Legend = () => (
  <div className="legend" aria-hidden="true">
    <span style={{ "--c": "var(--agree)" }}>{t("legendAgree")}</span>
    <span style={{ "--c": "var(--disagree)" }}>{t("legendDisagree")}</span>
    <span style={{ "--c": "var(--pass)" }}>{t("legendPass")}</span>
    <span style={{ "--c": "var(--novote)" }}>{t("legendNoVote")}</span>
  </div>
);

class CommentList extends React.Component {
  render() {
    const { math, groupNames, ptptCount, tidsToRender } = this.props;
    const comments = _.keyBy(this.props.comments, "tid");
    const groups = math["group-votes"];
    const nCols = 1 + _.size(groups);
    return (
      <div className="sl" style={{ "--cols": nCols }}>
        <div className="sl__head">
          <div>{t("colStatement")}</div>
          <div>
            {t("colAll")}
            <small>{fmt("members", { n: ptptCount })}</small>
          </div>
          {_.map(groups, (g, i) => (
            <div key={i}>
              {groupLabel(groupNames, Number(i))}
              <small>{fmt("members", { n: g["n-members"] })}</small>
            </div>
          ))}
        </div>
        {tidsToRender.map((tid) => (
          <Row key={tid} comment={comments[tid]} groups={groups} groupNames={groupNames} ptptCount={ptptCount} />
        ))}
      </div>
    );
  }
}

export default CommentList;
