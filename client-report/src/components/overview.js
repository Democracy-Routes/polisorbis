// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import _ from "lodash";
import { t, fmt } from "../strings";

const computeVoteTotal = (users) => {
  let voteTotal = 0;
  _.each(users, (count) => {
    voteTotal += count;
  });
  return voteTotal;
};

const Tile = ({ number, label }) => (
  <div className="tile">
    <div className="tile__n">{number.toLocaleString()}</div>
    <div className="tile__l">{label}</div>
  </div>
);

const Overview = ({ conversation, ptptCount, ptptCountTotal, math, computedStats }) => (
  <section className="sec" id="overview">
    <h2>{t("overview")}</h2>
    <p className="lead">{t("overviewIntro")}</p>
    {conversation && (conversation.ownername || conversation.topic) ? (
      <p className="lead">
        {conversation.ownername ? fmt("runBy", { owner: conversation.ownername }) + " " : null}
        {conversation.topic ? fmt("topicWas", { topic: conversation.topic }) : null}
      </p>
    ) : null}
    <div className="tiles">
      <Tile number={ptptCountTotal} label={t("statVoters")} />
      <Tile number={ptptCount} label={t("statGrouped")} />
      <Tile number={computeVoteTotal(math["user-vote-counts"])} label={t("statVotes")} />
      <Tile number={math["n-cmts"]} label={t("statStatements")} />
      <Tile number={computedStats.votesPerVoterAvg.toFixed(2)} label={t("statVotesPerVoter")} />
      <Tile number={computedStats.commentsPerCommenterAvg.toFixed(2)} label={t("statStatementsPerAuthor")} />
    </div>
  </section>
);

export default Overview;
