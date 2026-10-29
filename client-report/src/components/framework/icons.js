// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// Seven small inline icons for the section nav (16px, currentColor).

import React from "react";

const base = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

const paths = {
  overview: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  divisive: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M12 12h9" /></>,
  majority: <path d="M4 12.5l5 5L20 6.5" />,
  groups: <><circle cx="8" cy="9" r="3" /><circle cx="16.5" cy="10" r="2.5" /><path d="M2.5 19c.5-3 3-5 5.5-5s5 2 5.5 5M13.5 18c.4-2 2-3.5 3.5-3.5s3 1.5 3.5 3.5" /></>,
  uncertainty: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" /></>,
  map: <><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></>,
  all: <path d="M5 7h14M5 12h14M5 17h9" />,
  more: <><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" /></>,
  open: <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />,
};

const Icon = ({ name, size }) => (
  <svg {...base} width={size || 16} height={size || 16}>
    {paths[name] || null}
  </svg>
);

export default Icon;
