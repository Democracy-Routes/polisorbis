// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// A titled card for the organizer pages: title and explanation on the left,
// the controls on the right from 52em, stacked on phones.

/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Box, Heading, Text, jsx } from 'theme-ui'

const Section = ({ title, intro, children, danger, id }) => (
  <Box
    as="section"
    id={id}
    sx={{
      variant: 'cards.primary',
      p: [3, 4],
      mb: 3,
      borderColor: danger ? '#fecaca' : 'border',
      display: 'grid',
      gridTemplateColumns: ['1fr', null, null, '14em minmax(0, 1fr)'],
      columnGap: 4,
      rowGap: 3,
      alignItems: 'start'
    }}>
    <Box>
      <Heading as="h2" sx={{ fontSize: 3, lineHeight: 'heading', color: danger ? 'red' : 'text' }}>
        {title}
      </Heading>
      {intro ? (
        <Text sx={{ color: 'muted', fontSize: 1, mt: 1 }}>{intro}</Text>
      ) : null}
    </Box>
    <Box sx={{ minWidth: 0 }}>{children}</Box>
  </Box>
)

Section.propTypes = {
  title: PropTypes.string.isRequired,
  intro: PropTypes.node,
  children: PropTypes.node,
  danger: PropTypes.bool,
  id: PropTypes.string
}

export default Section
