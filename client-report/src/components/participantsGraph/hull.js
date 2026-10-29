// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import * as globals from "../globals";

const Hull = ({ hull, k }) => {
  const line = d3.line().curve(d3.curveLinear);
  const gid = hull.group[0].gid;
  return (
    <path
      d={line(hull.hull)}
      strokeDasharray={`${6 * k}, ${6 * k}`}
      strokeWidth={1.5 * k}
      stroke={globals.groupColor(gid)}
      fill={globals.groupColor(gid)}
      fillOpacity={0.06}
    />
  );
};

export default Hull;
