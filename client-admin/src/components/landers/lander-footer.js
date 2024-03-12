/** @jsx jsx */
import { Component } from 'react'
import { Box, Link, Heading, jsx } from 'theme-ui'

import emoji from 'react-easy-emoji'

const tosUrl = process.env.P_TOS_URL;
const privacyUrl = process.env.P_PRIVACY_POLICY_URL;

class Header extends Component {
  render() {
    return (
      <Box sx={{ mt: [3, null, 4] }}>
        <Heading
          as="h3"
          sx={{ fontSize: [4], lineHeight: 'body', my: [2, null, 3] }}>
          Legal
        </Heading>
        <Box sx={{ mb: [2, null, 3] }}>
			<Link href={tosUrl}>Terms of Service</Link>{' - '}
          <Link href={privacyUrl}>Privacy</Link>
        </Box>
      </Box>
    )
  }
}

export default Header
