// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import _ from "lodash";

// Statement numbers on the opinion map. `k` scales the label with the
// rendered size of the SVG (see participantsGraph.js).
class Comments extends React.Component {
  render() {
    const { points, comments, xCenter, yCenter, xScaleup, yScaleup, k, selectedTid, handleClick } = this.props;
    const byTid = _.keyBy(comments, "tid");
    return (
      <g>
        {points.map((comment, i) => {
          const c = byTid[comment.tid];
          if (!c || c.is_meta) return null;
          const x = xCenter + comment.x * xScaleup;
          const y = yCenter + comment.y * yScaleup;
          const selected = selectedTid === comment.tid;
          return (
            <g key={i} transform={`translate(${x}, ${y})`} onClick={handleClick(comment)} style={{ cursor: "pointer" }}>
              <title>{c.txt}</title>
              <circle r={11 * k} fill={selected ? "#c2410c" : "transparent"} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={selected ? "#fff" : "rgba(15,23,42,.65)"}
                fontSize={11 * k}
                fontWeight={selected ? 600 : 400}>
                {comment.tid}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
}

export default Comments;
