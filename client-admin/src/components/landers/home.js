// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>

/** @jsx jsx */

import React from 'react'
import { Link } from 'react-router-dom'
import { Heading, Box, Flex, Text, Button, jsx } from 'theme-ui'
import Layout from './lander-layout'
import PolisNet from '../../util/net'
import Url from '../../util/url'

const claim = process.env.P_CLAIM
const description = process.env.P_DESCRIPTION
const repoUrl = process.env.P_REPO_URL

// Home page: a short introduction and the open conversations an organizer
// chose to list (GET /api/v3/listed-conversations, public).
class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = { conversations: null, failed: false }
  }

  componentDidMount() {
    PolisNet.polisGet('/api/v3/listed-conversations').then(
      (res) => this.setState({ conversations: (res && res.conversations) || [] }),
      () => this.setState({ conversations: [], failed: true })
    )
  }

  renderCard(c) {
    const n = c.participant_count || 0
    return (
      <Box
        key={c.conversation_id}
        data-test-id="listed-conversation"
        sx={{ variant: 'cards.primary', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <Text sx={{ fontWeight: 'bold', fontSize: 3, lineHeight: 'heading', overflowWrap: 'anywhere' }}>{c.topic}</Text>
        {c.description ? (
          <Text
            sx={{
              color: 'muted',
              fontSize: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              overflowWrap: 'anywhere'
            }}>
            {c.description}
          </Text>
        ) : null}
        <Text sx={{ fontSize: 1, color: 'muted' }}>
          {n} {n === 1 ? 'participant' : 'participants'}
        </Text>
        <Flex sx={{ gap: 3, mt: 'auto', pt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href={Url.urlPrefix + c.conversation_id} sx={{ textDecoration: 'none' }}>
            <Button as="span" sx={{ display: 'inline-block', px: 4 }}>
              Vote
            </Button>
          </a>
          {c.report_id ? (
            <a href={Url.urlPrefix + 'report/' + c.report_id} sx={{ fontSize: 1 }}>
              See the results
            </a>
          ) : null}
        </Flex>
      </Box>
    )
  }

  render() {
    const { conversations } = this.state
    return (
      <Layout>
        <Box sx={{ py: [4, null, 5] }}>
          <Heading
            as="h1"
            sx={{ fontFamily: 'display', fontWeight: 600, fontSize: [6, null, 7], lineHeight: 'heading', mb: [3, null, 4], maxWidth: '14em' }}>
            {claim}
          </Heading>
          <Text as="p" sx={{ fontSize: [2, null, 3], lineHeight: 'body', color: 'muted', mb: [4], maxWidth: '36em' }}>
            {description}
          </Text>
          <Text as="p" sx={{ fontSize: 1, color: 'muted', mb: [4, null, 5] }}>
            Organizer?{' '}
            <Link to="/signin" sx={{ fontWeight: 'bold' }}>
              Sign in
            </Link>
          </Text>

          <Heading as="h2" sx={{ fontSize: [3, 4], lineHeight: 'heading', mb: 3 }}>
            Open conversations
          </Heading>
          {conversations === null ? null : conversations.length ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: ['1fr', null, '1fr 1fr'], gap: 3, alignItems: 'stretch' }}>
              {conversations.map((c) => this.renderCard(c))}
            </Box>
          ) : (
            <Text sx={{ color: 'muted', fontSize: 1 }}>No public conversations at the moment.</Text>
          )}

          <Text sx={{ mt: [5], fontSize: [1], color: 'muted' }}>
            Free software, GNU AGPL.{' '}
            <a href={repoUrl} sx={{ fontWeight: 'body' }}>
              Source code
            </a>
          </Text>
        </Box>
      </Layout>
    )
  }
}

export default Index
