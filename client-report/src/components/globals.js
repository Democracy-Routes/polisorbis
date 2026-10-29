// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>

// Layout is in report.css; this file keeps the constants the maths and the
// charts share.

export const side = 1200; // the opinion map's coordinate space (util/graphUtil.js)

// Thresholds quoted in the copy; the data code uses the same constants.
export const majorityThreshold = 0.6;
export const uncertaintyThreshold = 0.3;
export const minParticipantsForReport = 7;

export const brandColors = {
  agree: "#15803d",
  agreeColorblind: "#1d4ed8",
  disagree: "#b91c1c",
  disagreeColorblind: "#c2410c",
  pass: "#cbd5e1",
  comment: "#1d4ed8",
  blue: "#1d4ed8",
  yellowForRadial: "#DFE74D",
  mediumGrey: "#94a3b8",
  lightgrey: "#e2e8f0",
};

export const allCommentsSortDefault = "tid";

// Duplicated in polisClientParticipation/vis2/components/globals.js
export const groupLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
export const groupSymbols = ["○", "◆", "+", "-", "◬", "▮"];

export const groupColor = (gid) => {
  const colors = ["#7f63b8", "#86a542", "#b84c7d", "#50b47b", "#b94c3e", "#c18839"];
  return colors[gid] || "#b91c1c";
};
