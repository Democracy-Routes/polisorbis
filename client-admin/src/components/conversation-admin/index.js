// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, Text, jsx } from 'theme-ui'
import { populateZidMetadataStore, resetMetadataStore } from '../../actions'
import { Switch, Route, Link } from 'react-router-dom'

import ConversationConfig from './conversation-config'
import ModerateComments from './comment-moderation/'
import Results from './results'
import Url from '../../util/url'

// Three sections per conversation: Set up (/m/:id), Moderate
// (/m/:id/comments), Results (/m/:id/results; the old share, stats and
// reports paths show the same page so saved links keep working).
const TABS = [
  ['', 'Set up', (u) => !u || u === 'setup'],
  ['/comments', 'Moderate', (u) => u === 'comments'],
  ['/results', 'Results', (u) => u === 'results' || u === 'share' || u === 'stats' || u === 'reports']
]

@connect((state) => state.zid_metadata)
class ConversationAdminContainer extends React.Component {
  loadZidMetadata() {
    this.props.dispatch(populateZidMetadataStore(this.props.match.params.conversation_id))
  }

  resetMetadata() {
    this.props.dispatch(resetMetadataStore())
  }

  componentWillMount() {
    this.loadZidMetadata()
  }

  componentWillUnmount() {
    this.resetMetadata()
  }

  componentDidUpdate() {
    this.loadZidMetadata()
  }

  render() {
    const { match, location, zid_metadata } = this.props
    const url = location.pathname.split('/')[3]
    const topic = (zid_metadata && zid_metadata.topic) || ''
    const isActive = zid_metadata && zid_metadata.is_active !== false
    const publicUrl = Url.urlPrefix + match.params.conversation_id

    return (
      <Box>
        <Box sx={{ bg: 'surface', borderBottom: '1px solid', borderBottomColor: 'border' }}>
          <Box sx={{ maxWidth: '64em', mx: 'auto', px: [3, 4], pt: 3 }}>
            <Flex sx={{ alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
              <Link to="/" sx={{ variant: 'links.nav', fontSize: 1, color: 'muted', borderBottom: 'none', flexShrink: 0 }}>
                ← Conversations
              </Link>
              {zid_metadata && zid_metadata.conversation_id ? (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ ml: 'auto', fontSize: 1, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  Open voting page ↗
                </a>
              ) : null}
            </Flex>
            <Flex sx={{ alignItems: 'center', gap: 2, mt: 1, minWidth: 0 }}>
              <Text
                as="h1"
                data-test-id="conversation-title"
                sx={{
                  fontSize: [3, 4],
                  fontWeight: 'bold',
                  lineHeight: 'heading',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                {topic || 'Untitled conversation'}
              </Text>
              {zid_metadata && zid_metadata.conversation_id ? (
                <Text
                  sx={{
                    flexShrink: 0,
                    fontSize: 0,
                    fontWeight: 'bold',
                    px: 2,
                    py: '2px',
                    borderRadius: 'pill',
                    bg: isActive ? '#dcfce7' : 'secondary',
                    color: isActive ? '#166534' : 'muted'
                  }}>
                  {isActive ? 'Open' : 'Closed'}
                </Text>
              ) : null}
            </Flex>
            <Flex as="nav" sx={{ mt: 2, gap: [3, 4] }}>
              {TABS.map(([suffix, label, isOn]) => (
                <Link
                  key={label}
                  to={`${match.url}${suffix}`}
                  sx={{
                    variant: isOn(url) ? 'links.activeNav' : 'links.nav',
                    pb: 2,
                    fontSize: 2,
                    borderBottomWidth: '3px'
                  }}>
                  {label}
                </Link>
              ))}
            </Flex>
          </Box>
        </Box>
        <Box sx={{ maxWidth: '64em', mx: 'auto', px: [3, 4], py: [3, 4] }}>
          <Switch>
            <Route exact path={`${match.path}/`} component={ConversationConfig} />
            <Route exact path={`${match.path}/setup`} component={ConversationConfig} />
            <Route path={`${match.path}/comments`} component={ModerateComments} />
            <Route exact path={`${match.path}/results`} component={Results} />
            <Route exact path={`${match.path}/share`} component={Results} />
            <Route exact path={`${match.path}/stats`} component={Results} />
            <Route exact path={`${match.path}/reports`} component={Results} />
          </Switch>
        </Box>
      </Box>
    )
  }
}

export default ConversationAdminContainer
