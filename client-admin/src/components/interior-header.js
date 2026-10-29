/** @jsx jsx */
import React from 'react'
import { Box, Flex, jsx, Link as ThemeUILink } from 'theme-ui'
import { Link, withRouter } from 'react-router-dom'
import Logomark from './framework/logomark'

const pTitle = process.env.P_TITLE

// One top bar for every signed-in page: brand on the left (to the
// conversations list), the two global links and sign out on the right.
// Pages inside a conversation add their own sub-bar (conversation-admin).
class InteriorHeader extends React.Component {
  render() {
    const path = (this.props.location && this.props.location.pathname) || ''
    const onAccount = path.indexOf('/account') === 0
    const onList = path === '/' || path.indexOf('/conversations') === 0
    const item = (active) => ({
      variant: 'links.header',
      fontSize: 1,
      opacity: active ? 1 : 0.85,
      borderBottom: '2px solid',
      borderBottomColor: active ? 'background' : 'transparent',
      pb: '2px',
      whiteSpace: 'nowrap'
    })
    return (
      <Box>
        <Box sx={{ width: '100%', backgroundColor: 'primary', color: 'background', zIndex: 1000, py: 2 }}>
          <Flex
            sx={{
              maxWidth: '64em',
              mx: 'auto',
              px: [3, 4],
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3
            }}>
            <Link to="/" sx={{ variant: 'links.header', display: 'inline-flex', alignItems: 'center', minWidth: 0, flex: '1 1 auto' }}>
              <Logomark style={{ marginRight: 10, position: 'relative', top: 6, flexShrink: 0 }} fill={'white'} />
              <span sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pTitle}</span>
            </Link>
            <Flex sx={{ alignItems: 'center', gap: [3, 4], flexShrink: 0 }}>
              <Link to="/" sx={Object.assign(item(onList), { display: ['none', 'inline'] })}>
                Conversations
              </Link>
              <Link to="/account" sx={item(onAccount)}>
                Account
              </Link>
              <Link id="signoutLink" to="/signout" sx={item(false)}>
                Sign out
              </Link>
            </Flex>
          </Flex>
        </Box>
        <Box>{this.props.children}</Box>
      </Box>
    )
  }
}

export default withRouter(InteriorHeader)
