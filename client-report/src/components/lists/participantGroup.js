// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import _ from "lodash";
import CommentList, { groupLabel } from "./commentList";
import { t, fmt } from "../../strings";

const ParticipantGroup = ({ gid, groupComments, comments, groupVotesForThisGroup, ptptCount, groupNames, math }) => (
  <div>
    <h3>{fmt("groupHeading", { name: groupLabel(groupNames, gid), n: groupVotesForThisGroup["n-members"] })}</h3>
    <p className="lead">{t("groupIntro")}</p>
    <CommentList
      math={math}
      ptptCount={ptptCount}
      groupNames={groupNames}
      tidsToRender={_.map(groupComments, "tid")}
      comments={comments}
    />
  </div>
);

export default ParticipantGroup;
