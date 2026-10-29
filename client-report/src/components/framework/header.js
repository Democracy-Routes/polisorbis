// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// Sticky top bar: brand, conversation topic, the settings (inline on
// laptops, behind a "…" menu on phones) and the section nav with icons.
// On phones the sections are a horizontal story (report.css); the nav
// scrolls to a section and follows the one in view.

import React from "react";
import Url from "../../util/url";
import Icon from "./icons";
import { t } from "../../strings";

const pLogoIcoURL = process.env.P_LOGO_ICO_URL;
const pLogoURL = process.env.P_LOGO_URL;
const pTitle = process.env.P_TITLE;

export const SECTIONS = [
  ["summary", "navSummary", "overview"],
  ["divisive", "navDivisive", "divisive"],
  ["majority", "navMajority", "majority"],
  ["groups", "navGroups", "groups"],
  ["uncertainty", "navUncertainty", "uncertainty"],
  ["map", "navMap", "map"],
  ["all", "navAll", "all"],
];

export function goToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start", inline: "start" });
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.el = React.createRef();
    this.state = { menu: false, active: "summary" };
  }

  componentDidMount() {
    // which section is in view (phones: the story page; laptops: the top one)
    if (typeof IntersectionObserver !== "undefined") {
      this.observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length) this.setState({ active: visible[0].target.id });
        },
        { threshold: [0.5] }
      );
      this.observeSections();
    }
    // the sticky header's height, for the story pages' max-height
    const setH = () => {
      if (this.el.current) document.documentElement.style.setProperty("--rh", this.el.current.offsetHeight + "px");
    };
    setH();
    if (typeof ResizeObserver !== "undefined" && this.el.current) {
      this.ro = new ResizeObserver(setH);
      this.ro.observe(this.el.current);
    }
    this.closeMenu = (e) => {
      if (this.state.menu && this.el.current && !this.el.current.contains(e.target)) this.setState({ menu: false });
    };
    document.addEventListener("click", this.closeMenu);
  }

  componentDidUpdate() {
    this.observeSections();
  }

  observeSections() {
    if (!this.observer) return;
    document.querySelectorAll("section.sec").forEach((s) => this.observer.observe(s));
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
    if (this.ro) this.ro.disconnect();
    document.removeEventListener("click", this.closeMenu);
  }

  render() {
    const { conversation, autoRefresh, onAutoRefresh, colorBlind, onColorBlind } = this.props;
    const link = conversation ? Url.urlPrefix + conversation.conversation_id : null;
    const toggles = (cls) => (
      <div className={cls}>
        <label className="rh__toggle">
          <input type="checkbox" checked={!!autoRefresh} onChange={(e) => onAutoRefresh(e.target.checked)} />
          {t("autoRefresh")}
        </label>
        <label className="rh__toggle">
          <input type="checkbox" checked={!!colorBlind} onChange={(e) => onColorBlind(e.target.checked)} />
          {t("colorBlind")}
        </label>
        {link ? (
          <a className="rh__open" href={link}>
            <Icon name="open" /> {t("openConversation")}
          </a>
        ) : null}
      </div>
    );
    return (
      <header className="rh" ref={this.el}>
        <div className="rh__row">
          <a className="rh__brand" href={pLogoURL} title={pTitle}>
            <img src={pLogoIcoURL} alt="" />
            <span className="rh__brandname">{pTitle}</span>
          </a>
          <h1 className="rh__title">{conversation ? conversation.topic || t("report") : t("loading")}</h1>
          {toggles("rh__actions")}
          <button
            type="button"
            className="rh__more"
            aria-label={t("settings")}
            aria-expanded={this.state.menu ? "true" : "false"}
            onClick={() => this.setState({ menu: !this.state.menu })}>
            <Icon name="more" size={20} />
          </button>
          {this.state.menu ? toggles("rh__menu") : null}
        </div>
        <nav className="rnav" aria-label={t("report")}>
          {SECTIONS.map(([id, key, icon]) => (
            <a
              key={id}
              href={"#" + id}
              className={this.state.active === id ? "is-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                goToSection(id);
              }}>
              <Icon name={icon} />
              <span>{t(key)}</span>
            </a>
          ))}
        </nav>
        <div className="rdots" aria-hidden="true">
          {SECTIONS.map(([id]) => (
            <i key={id} className={this.state.active === id ? "is-active" : ""} />
          ))}
        </div>
      </header>
    );
  }
}

export default Header;
