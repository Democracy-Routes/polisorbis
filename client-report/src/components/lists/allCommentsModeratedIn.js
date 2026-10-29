// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import _ from "lodash";
import CommentList, { Legend } from "./commentList";
import * as globals from "../globals";
import { t } from "../../strings";

const byDesc = (field) => (comments) => _.map(_.reverse(_.sortBy(comments, field)), (c) => c.tid);

const SORTS = {
  tid: (comments) => _.map(comments, (c) => c.tid).sort((a, b) => a - b),
  consensus: byDesc((c) => c["group-aware-consensus"]),
  numvotes: byDesc("count"),
  pctAgreed: byDesc("pctAgreed"),
  pctDisagreed: byDesc("pctDisagreed"),
  pctPassed: byDesc("pctPassed"),
};
const OPTIONS = [
  ["tid", "sortTid"],
  ["consensus", "sortConsensus"],
  ["numvotes", "sortVotes"],
  ["pctAgreed", "sortAgreed"],
  ["pctDisagreed", "sortDisagreed"],
  ["pctPassed", "sortPassed"],
];

class AllCommentsModeratedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sortStyle: globals.allCommentsSortDefault };
  }

  render() {
    const { conversation, comments, math, ptptCount, groupNames } = this.props;
    if (!conversation) return null;
    const sortFunction = SORTS[this.state.sortStyle] || SORTS.tid;
    return (
      <section className="sec" id="all">
        <h2>{t("all")}</h2>
        <p className="lead">{t("allIntro")}</p>
        <div className="sort">
          <label htmlFor="allCommentsSortMode">{t("sortBy")}</label>
          <select
            id="allCommentsSortMode"
            value={this.state.sortStyle}
            onChange={(e) => this.setState({ sortStyle: e.target.value })}>
            {OPTIONS.map(([v, k]) => (
              <option key={v} value={v}>
                {t(k)}
              </option>
            ))}
          </select>
        </div>
        <Legend />
        <CommentList math={math} ptptCount={ptptCount} groupNames={groupNames} tidsToRender={sortFunction(comments)} comments={comments} />
      </section>
    );
  }
}

export default AllCommentsModeratedIn;
