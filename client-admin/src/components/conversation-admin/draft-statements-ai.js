// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { populateAllCommentStores } from '../../actions'
import PolisNet from '../../util/net'
import { Box, Flex, Text, Button, jsx } from 'theme-ui'

// Asks the server's AI drafting endpoint for seed statements, shows them as
// an editable list for the organizer to review, refine and tick, then adds
// the ticked ones through POST /api/v3/comments-bulk. Hidden when the server
// has no AI provider configured (GET /api/v3/ai/status).

const SOFT_LENGTH = 140
const MAX_LENGTH = 400
const LANGUAGES = [
  ['', 'same language as my request'],
  ['en', 'English'],
  ['it', 'Italiano'],
  ['de', 'Deutsch'],
  ['fr', 'Français'],
  ['es', 'Español']
]

const field = {
  fontFamily: 'body',
  fontSize: [2],
  width: '100%',
  maxWidth: '35em',
  padding: [2],
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'mediumGray'
}

const errorText = (err) => {
  const reason = err && err.responseText
  if (reason === 'polis_err_ai_rate_limited') {
    return 'You have used this hour’s budget of drafts. Try again in a few minutes.'
  }
  if (reason === 'polis_err_ai_bad_response' || reason === 'polis_err_ai_upstream') {
    return 'The model did not answer usefully. Try again, or reword the request.'
  }
  return 'Drafting failed' + (reason ? ': ' + reason : '.')
}

const toCsv = (texts) =>
  'comment_text\n' + texts.map((t) => '"' + t.replace(/"/g, '""') + '"').join('\n') + '\n'

let nextId = 1

@connect()
class DraftStatementsAi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enabled: null,
      provider: '',
      request: '',
      count: 10,
      language: '',
      instruction: '',
      rows: [],
      loading: false,
      adding: false,
      error: null,
      addResult: null
    }
  }

  componentDidMount() {
    PolisNet.polisGet('/api/v3/ai/status').then(
      (res) => this.setState({ enabled: Boolean(res && res.enabled), provider: (res && res.provider) || '' }),
      () => this.setState({ enabled: false })
    )
  }

  ticked() {
    return this.state.rows.filter((r) => r.checked)
  }

  draft(refine) {
    const { request, count, language, instruction } = this.state
    const kept = refine ? this.ticked().map((r) => r.txt.trim()).filter(Boolean) : []
    const body = {
      conversation_id: this.props.params.conversation_id,
      request: request.trim(),
      count: Math.max(1, Math.min(40, Number(count) || 10)),
      kept
    }
    if (language) body.language = language
    if (refine && instruction.trim()) body.instruction = instruction.trim()
    this.setState({ loading: true, error: null, addResult: null })
    PolisNet.polisPost('/api/v3/ai/draft-statements', body).then(
      (res) => {
        const fresh = (res.statements || []).map((txt) => ({ id: nextId++, txt, checked: true }))
        const rows = refine ? this.ticked().concat(fresh) : fresh
        this.setState({ loading: false, rows, instruction: refine ? '' : instruction })
      },
      (err) => this.setState({ loading: false, error: errorText(err) })
    )
  }

  addSelected() {
    const texts = this.ticked()
      .map((r) => r.txt.trim())
      .filter((t) => t && t.length <= MAX_LENGTH)
    if (!texts.length) return
    const conversation_id = this.props.params.conversation_id
    this.setState({ adding: true, error: null, addResult: null })
    PolisNet.polisPost('/api/v3/comments-bulk', { conversation_id, csv: toCsv(texts) }).then(
      (res) => {
        const results = res.results || []
        const added = {}
        results.forEach((r) => {
          if (r.status === 'success' || (r.status === 'skipped' && r.reason === 'polis_err_post_comment_duplicate')) {
            added[r.txt] = true
          }
        })
        this.setState({
          adding: false,
          addResult: results,
          rows: this.state.rows.filter((r) => !added[r.txt.trim()])
        })
        this.props.dispatch(populateAllCommentStores(conversation_id))
      },
      (err) => this.setState({ adding: false, error: 'Adding failed' + (err && err.responseText ? ': ' + err.responseText : '.') })
    )
  }

  updateRow(id, patch) {
    this.setState({ rows: this.state.rows.map((r) => (r.id === id ? Object.assign({}, r, patch) : r)) })
  }

  removeRow(id) {
    this.setState({ rows: this.state.rows.filter((r) => r.id !== id) })
  }

  renderRow(row) {
    const len = row.txt.length
    const over = len > MAX_LENGTH
    return (
      <Flex key={row.id} sx={{ alignItems: 'flex-start', mb: [2], maxWidth: '35em' }}>
        <Box sx={{ flexShrink: 0, pt: '0.6em' }}>
          <input
            type="checkbox"
            checked={row.checked}
            onChange={(e) => this.updateRow(row.id, { checked: e.target.checked })}
          />
        </Box>
        <Box sx={{ ml: [2], flex: 1 }}>
          <textarea
            sx={Object.assign({}, field, { maxWidth: 'none', height: '3.4em', resize: 'vertical' })}
            value={row.txt}
            onChange={(e) => this.updateRow(row.id, { txt: e.target.value })}
          />
          <Flex sx={{ justifyContent: 'space-between', fontSize: [1], color: over ? 'red' : len > SOFT_LENGTH ? 'orange' : 'gray' }}>
            <Text>
              {len}/{SOFT_LENGTH}{over ? ' — too long to add' : len > SOFT_LENGTH ? ' — long for a statement' : ''}
            </Text>
            <a href="#" onClick={(e) => { e.preventDefault(); this.removeRow(row.id) }}>remove</a>
          </Flex>
        </Box>
      </Flex>
    )
  }

  renderAddResult() {
    const results = this.state.addResult
    if (!results) return null
    const count = (status) => results.filter((r) => r.status === status).length
    const problems = results.filter((r) => r.status !== 'success')
    return (
      <Box sx={{ mt: [2] }}>
        <Text>Added {count('success')}, skipped {count('skipped')}, failed {count('error')}.</Text>
        {problems.map((r, i) => (
          <Text key={i} sx={{ fontSize: [1], color: 'gray' }}>
            {r.status}: {r.reason} {r.txt ? '— ' + r.txt.slice(0, 80) : ''}
          </Text>
        ))}
      </Box>
    )
  }

  render() {
    const { enabled, provider, request, count, language, instruction, rows, loading, adding, error } = this.state
    if (!enabled) return null
    const ticked = this.ticked().length
    const busy = loading || adding
    return (
      <Box sx={{ mb: [4] }}>
        <Text sx={{ mb: [2], fontSize: [1], color: 'muted' }}>
          Describe the statements you want, for example &ldquo;20 statements about parking in the
          town centre, from different points of view&rdquo;. You review the list before anything is
          added.
        </Text>
        <Text sx={{ mb: [2], fontSize: [1], color: 'gray' }}>
          Your request and this conversation&rsquo;s title and description are sent to {provider}.
          Participants&rsquo; statements and votes are not.
        </Text>
        <Box sx={{ mb: [2] }}>
          <textarea
            sx={Object.assign({}, field, { height: '5em', resize: 'vertical' })}
            placeholder="What should the statements be about?"
            value={request}
            data-test-id="ai_request"
            onChange={(e) => this.setState({ request: e.target.value })}
          />
        </Box>
        <Flex sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: [2] }}>
          <Text sx={{ mr: [2] }}>Number</Text>
          <input
            type="number"
            min="1"
            max="40"
            sx={Object.assign({}, field, { width: '5em', mr: [3] })}
            value={count}
            onChange={(e) => this.setState({ count: e.target.value })}
          />
          <Text sx={{ mr: [2] }}>Language</Text>
          <select
            sx={Object.assign({}, field, { width: 'auto' })}
            value={language}
            onChange={(e) => this.setState({ language: e.target.value })}>
            {LANGUAGES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </Flex>
        <Box sx={{ mb: [3] }}>
          <Button disabled={busy || !request.trim()} onClick={() => this.draft(false)}>
            {loading ? 'Generating…' : rows.length ? 'Generate a new list' : 'Generate'}
          </Button>
        </Box>

        {rows.length ? (
          <Box>
            <Text sx={{ mb: [2] }}>
              Edit the statements, untick the ones you do not want, then add the rest.
            </Text>
            {rows.map((row) => this.renderRow(row))}
            <Flex sx={{ alignItems: 'center', flexWrap: 'wrap', mt: [3], mb: [2], maxWidth: '35em' }}>
              <input
                sx={Object.assign({}, field, { flex: 1, minWidth: '12em', mr: [2] })}
                placeholder="Refine: shorter, more critical views, more about water…"
                value={instruction}
                onChange={(e) => this.setState({ instruction: e.target.value })}
              />
              <Button disabled={busy || !request.trim()} onClick={() => this.draft(true)}>
                {loading ? 'Generating…' : 'Refine'}
              </Button>
            </Flex>
            <Text sx={{ mb: [2], fontSize: [1], color: 'gray' }}>
              Refine keeps the ticked statements and asks for new ones to replace the rest.
            </Text>
            <Button disabled={busy || !ticked} onClick={() => this.addSelected()}>
              {adding ? 'Adding…' : 'Add selected (' + ticked + ')'}
            </Button>
          </Box>
        ) : null}
        {error ? <Text sx={{ mt: [2], color: 'red' }}>{error}</Text> : null}
        {this.renderAddResult()}
      </Box>
    )
  }
}

export default DraftStatementsAi
