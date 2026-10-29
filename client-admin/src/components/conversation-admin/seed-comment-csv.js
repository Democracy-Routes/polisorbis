// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { populateAllCommentStores } from '../../actions'
import PolisNet from '../../util/net'
import { Box, Text, Button, jsx } from 'theme-ui'

// Uploads a CSV of seed statements to POST /api/v3/comments-bulk: the
// statements.csv exported by Citizens (position,statement) or upstream Polis's
// format (comment_text).
@connect()
class SeedCommentsCsv extends React.Component {
  constructor(props) {
    super(props)
    this.state = { csv: null, fileName: '', loading: false, result: null, error: null }
  }

  handleFileChange(e) {
    const file = e.target.files && e.target.files[0]
    this.setState({ csv: null, fileName: '', result: null, error: null })
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => this.setState({ csv: String(reader.result), fileName: file.name })
    reader.readAsText(file, 'utf-8')
  }

  handleUpload() {
    const conversation_id = this.props.params.conversation_id
    this.setState({ loading: true, result: null, error: null })
    PolisNet.polisPost('/api/v3/comments-bulk', { conversation_id, csv: this.state.csv }).then(
      (res) => {
        this.setState({ loading: false, result: res.results || [] })
        this.props.dispatch(populateAllCommentStores(conversation_id))
      },
      (err) => {
        const reason = err && err.responseText
        this.setState({
          loading: false,
          error:
            reason === 'polis_err_csv_header'
              ? 'The first row must be "position,statement" (Citizens export) or "comment_text".'
              : reason === 'polis_err_csv_malformed'
              ? 'The file is not a valid CSV (check quotes and line breaks).'
              : 'Upload failed' + (reason ? ': ' + reason : '.')
        })
      }
    )
  }

  renderResult() {
    const results = this.state.result
    if (!results) return null
    const count = (status) => results.filter((r) => r.status === status).length
    const problems = results.filter((r) => r.status !== 'success')
    return (
      <Box sx={{ mt: [2] }}>
        <Text>
          Added {count('success')}, skipped {count('skipped')}, failed {count('error')}.
        </Text>
        {problems.map((r, i) => (
          <Text key={i} sx={{ fontSize: [1], color: 'gray' }}>
            {r.status}: {r.reason} {r.txt ? '— ' + r.txt.slice(0, 80) : ''}
          </Text>
        ))}
      </Box>
    )
  }

  render() {
    const { csv, fileName, loading, error } = this.state
    return (
      <Box sx={{ mb: [4] }}>
        <Text sx={{ mb: [2] }}>
          Or upload a CSV of seed comments: the statements.csv exported by
          Citizens, or a file whose first row is comment_text. Duplicates and
          empty rows are skipped.
        </Text>
        <Box sx={{ mb: [2] }}>
          <input
            type="file"
            accept=".csv,text/csv"
            data-test-id="seed_csv"
            onChange={this.handleFileChange.bind(this)}
          />
        </Box>
        <Box>
          <Button disabled={!csv || loading} onClick={this.handleUpload.bind(this)}>
            {loading ? 'Uploading...' : fileName ? 'Upload ' + fileName : 'Upload'}
          </Button>
          {error ? <Text>{error}</Text> : null}
          {this.renderResult()}
        </Box>
      </Box>
    )
  }
}

export default SeedCommentsCsv
