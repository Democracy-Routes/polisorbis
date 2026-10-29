// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// Sticky top bar: brand, conversation topic, link to the conversation, the
// two settings, and the section navigation.

import React from "react";
import Url from "../../util/url";
import { t } from "../../strings";

const pLogoIcoURL = process.env.P_LOGO_ICO_URL;
const pLogoURL = process.env.P_LOGO_URL;
const pTitle = process.env.P_TITLE;

export const SECTIONS = [
  ["overview", "navOverview"],
  ["divisive", "navDivisive"],
  ["majority", "navMajority"],
  ["groups", "navGroups"],
  ["uncertainty", "navUncertainty"],
  ["map", "navMap"],
  ["all", "navAll"],
];

const Header = ({ conversation, autoRefresh, onAutoRefresh, colorBlind, onColorBlind }) => (
  <header className="rh">
    <div className="rh__row">
      <a className="rh__brand" href={pLogoURL}>
        <img src={pLogoIcoURL} alt="" />
        {pTitle}
      </a>
      <span className="rh__label">{t("report")}</span>
      <div className="rh__actions">
        <label className="rh__toggle">
          <input type="checkbox" checked={!!autoRefresh} onChange={(e) => onAutoRefresh(e.target.checked)} />
          {t("autoRefresh")}
        </label>
        <label className="rh__toggle">
          <input type="checkbox" checked={!!colorBlind} onChange={(e) => onColorBlind(e.target.checked)} />
          {t("colorBlind")}
        </label>
        {conversation ? (
          <a className="rh__open" href={Url.urlPrefix + conversation.conversation_id}>
            {t("openConversation")}
          </a>
        ) : null}
      </div>
      <h1 className="rh__title">{conversation ? conversation.topic || t("report") : t("loading")}</h1>
    </div>
    <nav className="rnav" aria-label={t("report")}>
      {SECTIONS.map(([id, key]) => (
        <a key={id} href={"#" + id}>
          {t(key)}
        </a>
      ))}
    </nav>
  </header>
);

export default Header;
