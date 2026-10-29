// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
//
// Beeswarm of statements by extremity (consensus on the left, divisive on
// the right). The chart takes the width of its container and lays itself
// out again when that width changes; the x position of a dot is
// x(extremity), as before, only the pixel range follows the width.

import React from "react";
import CommentList from "../lists/commentList";
import _ from "lodash";
import { t } from "../../strings";

const HEIGHT = 190;
const MARGIN = { top: 10, right: 12, bottom: 24, left: 12 };

class Beeswarm extends React.Component {
  constructor(props) {
    super(props);
    this.wrap = React.createRef();
    this.state = { current: null, cells: null, width: 0 };
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
    const width = Math.max(240, Math.floor(el.getBoundingClientRect().width));
    if (width !== this.state.width) this.layout(width);
  }

  layout(width) {
    const inner = width - MARGIN.left - MARGIN.right;
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
    const items = [];
    _.each(this.props.comments, (comment) => {
      if (this.props.extremity[comment.tid] > 0) {
        items.push(Object.assign({}, comment, { extremity: this.props.extremity[comment.tid] }));
      }
    });
    const x = d3.scaleLinear().rangeRound([0, inner]);
    x.domain(d3.extent(items, (d) => d.extremity));
    const r = width < 600 ? 5 : 4;
    const simulation = d3
      .forceSimulation(items)
      .force("x", d3.forceX((d) => x(d.extremity)).strength(1))
      .force("y", d3.forceY(innerH / 2))
      .force("collide", d3.forceCollide(r + 1))
      .stop();
    for (let i = 0; i < 120; ++i) simulation.tick();
    const cells = d3
      .voronoi()
      .extent([
        [-MARGIN.left, -MARGIN.top],
        [inner + MARGIN.right, innerH + MARGIN.bottom],
      ])
      .x((d) => d.x)
      .y((d) => d.y)
      .polygons(items);
    this.setState({ width, cells, r, innerH });
  }

  pick(cell) {
    return () => this.setState({ current: cell.data });
  }

  render() {
    const { width, cells, current, r, innerH } = this.state;
    return (
      <section className="sec" id="divisive">
        <h2>{t("divisive")}</h2>
        <p className="lead">{t("divisiveIntro")}</p>
        <p className="lead">{t("divisiveHow")}</p>
        <div className="swarm" ref={this.wrap}>
          {width ? (
            <svg viewBox={`0 0 ${width} ${HEIGHT}`} width={width} height={HEIGHT} role="img" aria-label={t("divisive")}>
              <line
                x1={MARGIN.left}
                y1={HEIGHT - MARGIN.bottom + 6}
                x2={width - MARGIN.right}
                y2={HEIGHT - MARGIN.bottom + 6}
                stroke="var(--line)"
                strokeWidth="1"
              />
              <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
                {cells
                  ? cells.map((cell, i) =>
                      cell ? (
                        <g key={i} className="dot" onMouseEnter={this.pick(cell)} onClick={this.pick(cell)}>
                          <path fill="none" style={{ pointerEvents: "all" }} d={"M" + cell.join("L") + "Z"} />
                          <circle
                            r={current && current.tid === cell.data.tid ? r + 2 : r}
                            fill={current && current.tid === cell.data.tid ? "var(--accent)" : "var(--primary)"}
                            fillOpacity={current && current.tid === cell.data.tid ? 1 : 0.75}
                            cx={cell.data.x}
                            cy={cell.data.y}
                          />
                        </g>
                      ) : null
                    )
                  : null}
              </g>
            </svg>
          ) : null}
          <div className="swarm__axis">
            <span>← {t("axisConsensus")}</span>
            <span>{t("axisDivisive")} →</span>
          </div>
        </div>
        <div className="swarm__pick">
          {current ? (
            <CommentList
              math={this.props.math}
              ptptCount={this.props.ptptCount}
              groupNames={this.props.groupNames}
              tidsToRender={[current.tid]}
              comments={this.props.comments}
            />
          ) : (
            <p className="note">{t("pickADot")}</p>
          )}
        </div>
      </section>
    );
  }
}

export default Beeswarm;
