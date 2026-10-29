// SPDX-FileCopyrightText: 2012-present The Polis Authors
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// Design tokens of the admin and landing pages (theme-ui). The same values
// are in client-participation/css/polis/base/_variables.scss and
// client-report/src/components/globals.js; see docs/branding.md. Fonts are
// self-hosted (public/fonts/brand, declared in public/index.ejs).

const brand = {
  primary: '#1d4ed8',
  primaryDark: '#1e40af',
  accent: '#c2410c',
  ink: '#0f172a',
  muted: '#475569',
  background: '#fffdf8',
  surface: '#ffffff',
  border: '#e2e8f0',
  agree: '#2ecc71',
  disagree: '#e74c3c'
}

const focusRing = {
  outline: '3px solid',
  outlineColor: 'accent',
  outlineOffset: '2px'
}

const field = {
  fontFamily: 'body',
  fontSize: 2,
  color: 'text',
  bg: 'surface',
  width: '100%',
  maxWidth: '35em',
  padding: 2,
  borderRadius: 'default',
  border: '1px solid',
  borderColor: 'border',
  '&:focus-visible': focusRing
}

export default {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    heading: 'inherit',
    display: "'Fraunces', Georgia, serif",
    monospace: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 600
  },
  sizes: {
    maxWidth: {
      paragraph: '35em'
    }
  },
  lineHeights: {
    body: 1.5,
    heading: 1.15
  },
  radii: {
    default: 8,
    pill: 999
  },
  shadows: {
    card: '0 1px 3px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.06)'
  },
  colors: {
    text: brand.ink,
    muted: brand.muted,
    background: brand.background,
    surface: brand.surface,
    primary: brand.primary,
    primaryDark: brand.primaryDark,
    accent: brand.accent,
    secondary: '#f1f5f9',
    border: brand.border,
    mediumGray: brand.muted,
    gray: brand.muted,
    red: '#b91c1c',
    orange: '#c2410c',
    agree: brand.agree,
    disagree: brand.disagree
  },
  links: {
    nav: {
      color: 'inherit',
      '&.active': { color: 'primary' },
      '&:hover': { color: 'primary' },
      '&:focus-visible': focusRing,
      textDecoration: 'none',
      fontSize: [2],
      fontWeight: 'bold',
      cursor: 'pointer',
      borderBottom: '2px solid',
      borderBottomColor: 'transparent',
      paddingBottom: '2px'
    },
    activeNav: {
      color: 'primary',
      '&.active': { color: 'primary' },
      '&:hover': { color: 'primaryDark' },
      '&:focus-visible': focusRing,
      textDecoration: 'none',
      fontSize: [2],
      fontWeight: 'bold',
      cursor: 'pointer',
      borderBottom: '2px solid',
      borderBottomColor: 'primary',
      paddingBottom: '2px'
    },
    header: {
      color: 'inherit',
      '&.active': { color: 'background' },
      '&:hover': { color: 'background', opacity: 0.85 },
      '&:focus-visible': focusRing,
      textDecoration: 'none',
      fontSize: [2],
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  },
  buttons: {
    primary: {
      color: 'surface',
      bg: 'primary',
      fontFamily: 'body',
      fontWeight: 'bold',
      fontSize: 2,
      lineHeight: 1.2,
      px: 3,
      py: 2,
      minHeight: 44,
      borderRadius: 'default',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 120ms ease',
      '&:hover': { bg: 'primaryDark' },
      '&:focus-visible': focusRing,
      '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }
    },
    secondary: {
      color: 'primary',
      bg: 'surface',
      fontFamily: 'body',
      fontWeight: 'bold',
      fontSize: 2,
      lineHeight: 1.2,
      px: 3,
      py: 2,
      minHeight: 44,
      borderRadius: 'default',
      border: '1px solid',
      borderColor: 'border',
      cursor: 'pointer',
      '&:hover': { borderColor: 'primary' },
      '&:focus-visible': focusRing,
      '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }
    },
    danger: {
      color: 'surface',
      bg: 'red',
      fontFamily: 'body',
      fontWeight: 'bold',
      fontSize: 2,
      lineHeight: 1.2,
      px: 3,
      py: 2,
      minHeight: 44,
      borderRadius: 'default',
      border: 'none',
      cursor: 'pointer',
      '&:focus-visible': focusRing
    }
  },
  forms: {
    input: field,
    textarea: Object.assign({}, field, { resize: 'vertical' }),
    select: Object.assign({}, field, { width: 'auto' })
  },
  cards: {
    primary: {
      backgroundColor: 'surface',
      color: 'text',
      padding: 3,
      borderRadius: 'default',
      border: '1px solid',
      borderColor: 'border',
      boxShadow: 'card'
    }
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      color: 'text',
      bg: 'background'
    },
    a: {
      color: 'primary',
      '&:active': { color: 'primaryDark' },
      '&:hover': { color: 'primaryDark', textDecoration: 'underline' },
      '&:focus-visible': focusRing,
      textDecoration: 'none',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  }
}
