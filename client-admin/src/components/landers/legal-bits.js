// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** @jsx jsx */

// Pieces used by the built-in privacy and terms pages (src/content/*.md).
// Operator details come from build-time variables (webpack DefinePlugin), so
// another installation fills in its own; when the essentials are missing the
// page says so instead of naming anyone.

import { Box, Text, jsx } from 'theme-ui'

export const operator = {
  name: process.env.P_OPERATOR_NAME || '',
  address: process.env.P_OPERATOR_ADDRESS || '',
  email: process.env.P_OPERATOR_EMAIL || '',
  dpo: process.env.P_OPERATOR_DPO || '',
  country: process.env.P_HOSTING_COUNTRY || '',
  authority: process.env.P_SUPERVISORY_AUTHORITY || '',
  retention: process.env.P_RETENTION || '',
  law: process.env.P_GOVERNING_LAW || '',
  ai: process.env.P_AI_PROVIDER_NAME || '',
  repo: process.env.P_REPO_URL || '',
  title: process.env.P_TITLE || 'Polis'
}

export const configured = Boolean(operator.name && operator.email)

const messages = {
  en: {
    missing:
      'Operator details are not configured on this installation. The ' +
      'operator must set its name, address and contact email ' +
      '(P_OPERATOR_NAME, P_OPERATOR_ADDRESS, P_OPERATOR_EMAIL) before ' +
      'opening this service to the public.',
    notSet: 'not set on this installation',
    dpo: 'Data protection officer',
    contact: 'Contact'
  },
  it: {
    missing:
      'I dati del titolare non sono configurati su questa installazione. Il ' +
      'titolare deve impostare nome, indirizzo e email di contatto ' +
      '(P_OPERATOR_NAME, P_OPERATOR_ADDRESS, P_OPERATOR_EMAIL) prima di ' +
      'aprire il servizio al pubblico.',
    notSet: 'non impostato su questa installazione',
    dpo: 'Responsabile della protezione dei dati',
    contact: 'Contatto'
  }
}

// A single configured value, or a visible marker when it is not set.
export const Var = ({ name, lang = 'en' }) => {
  const value = operator[name]
  return value ? (
    <span>{value}</span>
  ) : (
    <Text as="span" sx={{ color: 'red', fontStyle: 'italic' }}>
      [{messages[lang].notSet}]
    </Text>
  )
}

// The operator block: name, address, contact, data protection officer.
export const Operator = ({ lang = 'en' }) => {
  const m = messages[lang]
  if (!configured) {
    return (
      <Box
        sx={{
          my: [3],
          p: [3],
          border: '2px solid',
          borderColor: 'red',
          borderRadius: 2
        }}>
        <Text>{m.missing}</Text>
      </Box>
    )
  }
  return (
    <Box sx={{ my: [3], p: [3], bg: 'secondary', borderRadius: 2 }}>
      <Text sx={{ fontWeight: 'bold' }}>{operator.name}</Text>
      {operator.address ? <Text>{operator.address}</Text> : null}
      <Text>
        {m.contact}: <a href={'mailto:' + operator.email}>{operator.email}</a>
      </Text>
      {operator.dpo ? (
        <Text>
          {m.dpo}: {operator.dpo}
        </Text>
      ) : null}
    </Box>
  )
}

const aiMessages = {
  en: {
    on: (name) =>
      'One exception: organizers can ask an AI model to draft statements. ' +
      "When they do, their written request and the conversation's title and " +
      'description are sent to ' + name + ". Participants' statements and " +
      'votes are never sent.',
    off:
      "The optional AI drafting feature, which would send an organizer's " +
      'request to an AI provider, is switched off on this installation.'
  },
  it: {
    on: (name) =>
      "Un'eccezione: gli organizzatori possono chiedere a un modello di " +
      'intelligenza artificiale di abbozzare affermazioni. In quel caso la ' +
      'loro richiesta scritta e il titolo e la descrizione della ' +
      'conversazione vengono inviati a ' + name + '. Le affermazioni e i ' +
      'voti dei partecipanti non vengono mai inviati.',
    off:
      'La funzione opzionale di bozza con intelligenza artificiale, che ' +
      'invierebbe la richiesta di un organizzatore a un fornitore esterno, ' +
      'è disattivata su questa installazione.'
  }
}

// What the AI drafting feature sends, or that it is off.
export const AiNote = ({ lang = 'en' }) => {
  const m = aiMessages[lang]
  return <p>{operator.ai ? m.on(operator.ai) : m.off}</p>
}

// Language of the legal pages: ?lang=it|en, then the browser's language.
export function pickLang() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'it' || q === 'en') return q
    const nav = (navigator.language || '').toLowerCase()
    if (nav.startsWith('it')) return 'it'
  } catch (e) {
    // no window (tests) or no URLSearchParams: English
  }
  return 'en'
}
