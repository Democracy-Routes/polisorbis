// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import * as globals from "../globals";
import CommentList, { Legend } from "./commentList";
import { t, fmt } from "../../strings";

const MajorityStrict = ({ conversation, comments, ptptCount, consensus, math, groupNames }) => {
  if (!conversation) return null;
  const tids = [];
  consensus.agree.forEach((c) => tids.push(c.tid));
  consensus.disagree.forEach((c) => tids.push(c.tid));
  tids.sort((a, b) => a - b);
  const pct = Math.round(globals.majorityThreshold * 100);
  return (
    <section className="sec" id="majority">
      <h2>{t("majority")}</h2>
      <p className="lead">{t("majorityIntro")}</p>
      <p className="lead">{fmt("majorityRule", { pct })}</p>
      <Legend />
      {tids.length ? (
        <CommentList math={math} ptptCount={ptptCount} groupNames={groupNames} tidsToRender={tids} comments={comments} />
      ) : (
        <p className="empty">{fmt("majorityNone", { pct })}</p>
      )}
    </section>
  );
};

export default MajorityStrict;
