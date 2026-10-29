// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** @jsx jsx */

import React from 'react'
import { Box, Link, Text, jsx } from 'theme-ui'
import StaticLayout from './lander-layout'
import { pickLang } from './legal-bits'

// Renders one of the built-in legal pages in English or Italian, with a
// switch at the top. `en` and `it` are the MDX components.
class LegalPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { lang: pickLang() }
  }

  render() {
    const { lang } = this.state
    const Content = lang === 'it' ? this.props.it : this.props.en
    const other = lang === 'it' ? 'en' : 'it'
    return (
      <StaticLayout>
        <Box sx={{ mb: [3] }}>
          <Text as="span" sx={{ fontSize: [1], color: 'gray' }}>
            {lang === 'it' ? 'Leggi in ' : 'Read in '}
            <Link href="#" onClick={(e) => { e.preventDefault(); this.setState({ lang: other }) }}>
              {other === 'it' ? 'italiano' : 'English'}
            </Link>
          </Text>
        </Box>
        <Content />
      </StaticLayout>
    )
  }
}

export default LegalPage
