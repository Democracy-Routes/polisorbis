// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import CommentList from "./commentList";
import { t } from "../../strings";

const Metadata = ({ conversation, comments, ptptCount, math, groupNames }) => {
  if (!conversation) return null;
  const tids = comments.filter((c) => c.is_meta).map((c) => c.tid).sort((a, b) => a - b);
  if (!tids.length) return null;
  return (
    <div>
      <h3>{t("metadata")}</h3>
      <p className="lead">{t("metadataIntro")}</p>
      <CommentList math={math} ptptCount={ptptCount} groupNames={groupNames} tidsToRender={tids} comments={comments} />
    </div>
  );
};

export default Metadata;
