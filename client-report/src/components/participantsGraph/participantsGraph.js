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
      vb: { x: 0, y: 0, w: globals.side, h: globals.side },
      width: globals.side,
    };
    this.onResize = _.throttle(() => this.measure(), 150);
    this.pointers = new Map();
    this.lastTap = 0;
  }

  // --- pan and pinch zoom (viewBox), one finger drags, two pinch, double-tap resets
  onPointerDown(e) {
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
    if (this.pointers.size === 1) {
      const now = Date.now();
      if (now - this.lastTap < 320) this.resetZoom();
      this.lastTap = now;
    }
    this.moved = false;
  }
  onPointerMove(e) {
    if (!this.pointers.has(e.pointerId)) return;
    const prev = this.pointers.get(e.pointerId);
    const cur = { x: e.clientX, y: e.clientY };
    const { vb, width } = this.state;
    const unit = vb.w / (width || globals.side); // viewBox units per screen pixel
    if (this.pointers.size === 1) {
      const dx = (cur.x - prev.x) * unit;
      const dy = (cur.y - prev.y) * unit;
      if (Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y) > 2) this.moved = true;
      if (vb.w < globals.side) this.setVb({ x: vb.x - dx, y: vb.y - dy, w: vb.w, h: vb.h });
    } else if (this.pointers.size === 2) {
      const pts = [...this.pointers.entries()];
      const other = pts.find(([id]) => id !== e.pointerId)[1];
      const d0 = Math.hypot(prev.x - other.x, prev.y - other.y) || 1;
      const d1 = Math.hypot(cur.x - other.x, cur.y - other.y) || 1;
      const scale = d0 / d1;
      const w = Math.min(globals.side, Math.max(globals.side / 6, vb.w * scale));
      const rect = e.currentTarget.getBoundingClientRect();
      const mx = vb.x + ((cur.x + other.x) / 2 - rect.left) * unit;
      const my = vb.y + ((cur.y + other.y) / 2 - rect.top) * unit;
      const f = w / vb.w;
      this.moved = true;
      this.setVb({ x: mx - (mx - vb.x) * f, y: my - (my - vb.y) * f, w, h: w });
    }
    this.pointers.set(e.pointerId, cur);
  }
  onPointerUp(e) {
    this.pointers.delete(e.pointerId);
  }
  onWheel(e) {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const { vb, width } = this.state;
    const unit = vb.w / (width || globals.side);
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = vb.x + (e.clientX - rect.left) * unit;
    const my = vb.y + (e.clientY - rect.top) * unit;
    const w = Math.min(globals.side, Math.max(globals.side / 6, vb.w * (e.deltaY > 0 ? 1.15 : 0.87)));
    const f = w / vb.w;
    this.setVb({ x: mx - (mx - vb.x) * f, y: my - (my - vb.y) * f, w, h: w });
  }
  setVb(vb) {
    const max = globals.side - vb.w;
    vb.x = Math.min(Math.max(vb.x, 0), max);
    vb.y = Math.min(Math.max(vb.y, 0), max);
    this.setState({ vb, k: this.kFor(vb.w, this.state.width) });
  }
  resetZoom() {
    this.setVb({ x: 0, y: 0, w: globals.side, h: globals.side });
  }
  kFor(vbw, width) {
    return Math.min(3, Math.max(0.4, vbw / (width || globals.side)));
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
    const k = this.kFor(this.state.vb.w, w);
    if (Math.abs(k - this.state.k) > 0.05 || w !== this.state.width) this.setState({ k, width: w });
  }

  handleCommentClick(selectedComment) {
    return () => {
      if (this.moved) return; // a drag, not a tap
      this.setState({ selectedComment });
    };
  }

  render() {
    if (!this.props.math) return null;
    const { k, vb } = this.state;
    const zoomed = vb.w < globals.side;
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
          <svg
            viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            width={globals.side}
            height={globals.side}
            role="img"
            aria-label={t("map")}
            className={zoomed ? "is-zoomed" : ""}
            onPointerDown={this.onPointerDown.bind(this)}
            onPointerMove={this.onPointerMove.bind(this)}
            onPointerUp={this.onPointerUp.bind(this)}
            onPointerCancel={this.onPointerUp.bind(this)}
            onWheel={this.onWheel.bind(this)}>
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
          <div className="map__tools">
            <span className="note">{t("zoomHint")}</span>
            {zoomed ? (
              <button type="button" className="chip" onClick={() => this.resetZoom()}>
                {t("resetZoom")}
              </button>
            ) : null}
          </div>
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
