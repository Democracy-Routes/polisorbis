import React from 'react'
import Layout from './lander-layout'
import { Heading, Box, Text, Link } from 'theme-ui'
import ExploreKnowledgeBase from './exploreKnowledgeBase'
import ReadPress from './press'

const claim = process.env.P_CLAIM;
const description = process.env.P_DESCRIPTION;
const repoUrl = process.env.P_REPO_URL;
const openidEnabled = process.env.P_OPENID_ENABLED;

const Index = () => {
  return (
    <Layout>
      <Heading as="h1" sx={{ my: [4, null, 5], fontSize: [6, null, 7] }}>
        {claim}
      </Heading>
      <Heading
        as="h3"
        sx={{
          fontSize: [3, null, 4],
          lineHeight: 'body',
          mb: [4, null, 5]
        }}>
        {description}
      </Heading>
    </Layout>
  )
}

export default Index
