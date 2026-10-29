<!-- SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
# Branding

Name, logo, legal pages and the AI provider name are build-time variables
(`example.env`, `P_*`). The colours and fonts live in three files that must
be kept in step; change them together to rebrand an installation:

| Token | Value | client-admin `src/theme/index.js` | client-participation `css/polis/base/_variables.scss` | client-report `src/components/globals.js` |
|---|---|---|---|---|
| primary | `#1d4ed8` | `colors.primary` | `$brand-color`, `$brand-text-color` | `brandColors.blue`, `brandColors.comment` |
| primary, hover | `#1e40af` | `colors.primaryDark` | `$hover-color`, `$btn-hover-color` | |
| accent (focus ring) | `#c2410c` | `colors.accent` | `$accent` | |
| ink (text) | `#0f172a` | `colors.text` | `$ink` | |
| muted text | `#475569` | `colors.muted` | `$muted` | `brandColors.mediumGrey` |
| page background | `#fffdf8` / `#f7f7f3` | `colors.background` | `$page-bg` | |
| surface, border | `#ffffff`, `#e2e8f0` | `colors.surface`, `colors.border` | `$surface`, `$border` | |
| agree / disagree | `#2ecc71` / `#e74c3c` | `colors.agree/disagree` | `$color_agree`, `$color_disagree` (+ tinted button pairs) | `brandColors.agree/disagree` |
| radius | 8px | `radii.default` | `$radius` | |

Fonts: Space Grotesk 400/600 (UI, body) and Fraunces 600 (landing heading),
self-hosted under `client-admin/public/fonts/brand/` and served at
`/fonts/brand/` for every client; declared in `client-admin/public/index.ejs`,
`client-participation/css/polis_main.scss` and `client-report/src/index.css`.

## Report

`client-report/src/report.css` holds the same tokens as CSS variables on
`:root` (`--primary`, `--ink`, `--muted`, `--bg`, `--surface`, `--line`,
`--accent`) plus the vote colours `--agree #15803d`, `--disagree #b91c1c`,
`--pass #cbd5e1`, `--novote #f1f5f9`; the colour-blind switch
(`.report--cb`) swaps agree/disagree to `#1d4ed8` / `#c2410c`. Opinion-group
colours for the map stay in `src/components/globals.js`.
