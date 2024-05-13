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
      {/*
      <Box sx={{ mb: [4, null, 5] }}>
        <Text>
          Polis has been used all over the world by governments, academics,
          independent media and citizens, and is completely open source.
        </Text>
      </Box>
       */}
      <Heading
        as="h3"
        sx={{ fontSize: [4], lineHeight: 'body', mb: [2, null, 3] }}>
        Get Started
      </Heading>
      <Box sx={{ mb: [4, null, 5] }}>
        {!openidEnabled ? <Link href="/createuser">Sign up</Link> : <></>}
        {!openidEnabled ? ' or ' : ''}
        <Link href="/signin">Sign in</Link>
      </Box>
      {/* 
      <ReadPress />
      <ExploreKnowledgeBase />
       */}
      <Heading
        as="h3"
        sx={{ fontSize: [4], lineHeight: 'body', my: [2, null, 3] }}>
        Contribute
      </Heading>
      <Box sx={{ mb: [4, null, 5] }}>
        <Link href="https://doc.polisorbis.copernicani.it/">Know more about the PolisOrbis Project</Link>
      </Box>
      <Box sx={{ mb: [4, null, 5] }}>
        Explore the code and join the developer community{' '}
        <Link target="_blank" href={repoUrl}>
          on Gitlab
        </Link>
      </Box>
    </Layout>
  )
}

export default Index
