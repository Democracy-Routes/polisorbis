// SPDX-FileCopyrightText: 2012-present The Polis Authors
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** @jsx jsx */

import React from 'react'
import { Link } from 'react-router-dom'
import { Heading, Box, Text, Button, jsx } from 'theme-ui'
import Layout from './lander-layout'

const claim = process.env.P_CLAIM
const description = process.env.P_DESCRIPTION
const repoUrl = process.env.P_REPO_URL

const Index = () => {
  return (
    <Layout>
      <Box sx={{ py: [4, null, 5] }}>
        <Heading
          as="h1"
          sx={{
            fontFamily: 'display',
            fontWeight: 600,
            fontSize: [6, null, 7],
            lineHeight: 'heading',
            mb: [3, null, 4],
            maxWidth: '14em'
          }}>
          {claim}
        </Heading>
        <Text
          as="p"
          sx={{
            fontSize: [3, null, 4],
            lineHeight: 'body',
            color: 'muted',
            mb: [4, null, 5],
            maxWidth: '32em'
          }}>
          {description}
        </Text>
        <Link to="/signin" sx={{ textDecoration: 'none' }}>
          <Button as="span" sx={{ display: 'inline-block', px: 4 }}>
            Sign in
          </Button>
        </Link>
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

export default Index
