// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
//
// The opinion map. The coordinate space stays 1200x1200 (util/graphUtil.js
// is untouched); the SVG scales to its container through a viewBox, and a
// factor k = 1200 / rendered width enlarges text, markers and strokes so
// they stay legible on a phone.

import React from "react";
import _ from "lodash";
import * as globals from "../globals";
import graphUtil from "../../util/graphUtil";
import Axes from "../graphAxes";
import Comments from "../commentsGraph/comments";
import Hull from "./hull";
import CommentList, { groupLabel } from "../lists/commentList";
import { t } from "../../strings";

const Participants = ({ points, math, k }) => {
  if (!points) return null;
  return (
    <g>
      {points.map((pt, i) => (
        <g key={i}>
          <circle
            r={Math.sqrt(math["base-clusters"].count[pt.id]) * 3 * k}
            fill={globals.groupColor(pt.gid)}
            fillOpacity=".3"
            cx={pt.x}
            cy={pt.y}
          />
          <text
            fill={globals.groupColor(pt.gid)}
            fillOpacity=".8"
            fontSize={14 * k}
            textAnchor="middle"
            x={pt.x}
            y={pt.y + 5 * k}>
            {globals.groupSymbols[pt.gid]}
          </text>
        </g>
      ))}
    </g>
  );
};

const TOGGLES = [
  ["showAxes", "toggleAxes"],
  ["showRadialAxes", "toggleRadial"],
  ["showComments", "toggleStatements"],
  ["showParticipants", "toggleParticipants"],
  ["showGroupOutline", "toggleOutline"],
  ["showGroupLabels", "toggleLabels"],
];

class ParticipantsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.wrap = React.createRef();
    this.state = {
      selectedComment: null,
      showGroupLabels: true,
      showParticipants: false,
      showGroupOutline: true,
      showComments: true,
      showAxes: false,
      showRadialAxes: true,
      k: 1,
    };
    this.onResize = _.throttle(() => this.measure(), 150);
  }

  componentDidMount() {
    this.measure();
    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(() => this.measure());
      this.observer.observe(this.wrap.current);
    } else {
      window.addEventListener("resize", this.onResize);
    }
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.onResize);
  }

  measure() {
    const el = this.wrap.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width || globals.side;
    const k = Math.min(3, Math.max(1, globals.side / w));
    if (Math.abs(k - this.state.k) > 0.05) this.setState({ k });
  }

  handleCommentClick(selectedComment) {
    return () => this.setState({ selectedComment });
  }

  render() {
    if (!this.props.math) return null;
    const { k } = this.state;
    const { xx, yy, commentsPoints, xCenter, yCenter, baseClustersScaled, commentScaleupFactorX, commentScaleupFactorY, hulls } =
      graphUtil(this.props.comments, this.props.math, this.props.badTids);

    return (
      <section className="sec" id="map">
        <h2>{t("map")}</h2>
        <p className="lead">{t("mapIntro")}</p>
        <div className="chips" role="group">
          {TOGGLES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="chip"
              aria-pressed={this.state[key] ? "true" : "false"}
              onClick={() => this.setState({ [key]: !this.state[key] })}>
              {t(label)}
            </button>
          ))}
        </div>
        <div className="map" ref={this.wrap}>
          <svg viewBox={`0 0 ${globals.side} ${globals.side}`} width={globals.side} height={globals.side} role="img" aria-label={t("map")}>
            {this.state.showRadialAxes ? (
              <g>
                <circle strokeWidth={k} stroke="#e2e8f0" fill="#f8fafc" cx={xCenter} cy={yCenter} r={globals.side / 2.3} />
                <circle strokeWidth={k} stroke="#e2e8f0" fill="#f1f5f9" cx={xCenter} cy={yCenter} r={globals.side / 4} />
                <circle strokeWidth={k} stroke="#e2e8f0" fill="#f8fafc" cx={xCenter} cy={yCenter} r={globals.side / 8} />
              </g>
            ) : null}
            {this.state.showAxes ? <Axes xCenter={xCenter} yCenter={yCenter} k={k} /> : null}
            {this.state.showGroupOutline ? hulls.map((hull) => <Hull key={hull.group[0].gid} hull={hull} k={k} />) : null}
            {this.state.showParticipants ? <Participants math={this.props.math} points={baseClustersScaled} k={k} /> : null}
            {this.state.showComments ? (
              <Comments
                comments={this.props.comments}
                selectedTid={this.state.selectedComment ? this.state.selectedComment.tid : null}
                handleClick={this.handleCommentClick.bind(this)}
                points={commentsPoints}
                xCenter={xCenter}
                yCenter={yCenter}
                xScaleup={commentScaleupFactorX}
                yScaleup={commentScaleupFactorY}
                k={k}
              />
            ) : null}
            {this.state.showGroupLabels
              ? this.props.math["group-clusters"].map((g, i) => (
                  <text
                    key={i}
                    x={xx(g.center[0])}
                    y={yy(g.center[1])}
                    textAnchor="middle"
                    fill="rgba(15,23,42,.6)"
                    fontWeight="600"
                    fontSize={18 * k}>
                    {groupLabel(this.props.groupNames, g.id)}
                  </text>
                ))
              : null}
          </svg>
          {this.state.showParticipants ? (
            <div className="map__legend">
              {hulls.map((h, i) => (
                <span key={i} style={{ color: globals.groupColor(i) }}>
                  {globals.groupSymbols[i]} {groupLabel(this.props.groupNames, i)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="map__pick">
          {this.state.selectedComment ? (
            <CommentList
              math={this.props.math}
              ptptCount={this.props.ptptCount}
              groupNames={this.props.groupNames}
              tidsToRender={[this.state.selectedComment.tid]}
              comments={this.props.comments}
            />
          ) : (
            <p className="note">{t("mapHint")}</p>
          )}
        </div>
      </section>
    );
  }
}

export default ParticipantsGraph;
