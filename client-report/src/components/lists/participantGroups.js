// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import _ from "lodash";
import Group from "./participantGroup";
import Metadata from "./metadata";
import { Legend } from "./commentList";
import { t, fmt } from "../../strings";

const ParticipantGroups = ({ conversation, comments, math, ptptCount, groupNames }) => {
  if (!conversation || !math || !comments) return null;
  return (
    <section className="sec" id="groups">
      <h2>{t("groups")}</h2>
      <p className="lead">{fmt("groupsIntro", { n: ptptCount, k: _.size(math["group-votes"]) })}</p>
      <Legend />
      <Metadata math={math} comments={comments} conversation={conversation} ptptCount={ptptCount} groupNames={groupNames} />
      {_.map(math["repness"], (groupComments, gid) => (
        <Group
          key={gid}
          gid={Number(gid)}
          comments={comments}
          groupComments={groupComments}
          groupNames={groupNames}
          groupVotesForThisGroup={math["group-votes"][Number(gid)]}
          ptptCount={ptptCount}
          math={math}
        />
      ))}
    </section>
  );
};

export default ParticipantGroups;
