/** @jsx jsx */
import { jsx, Box, Flex, Text, Card } from 'theme-ui'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import Url from '../../util/url'

// One conversation in the list: title, status, description, numbers and
// the three sections as links. Deleting lives in Set up.
class Conversation extends React.Component {
  render() {
    const c = this.props.c
    const base = `/m/${c.conversation_id}`
    const open = c.is_active !== false
    const link = (to, label) => (
      <Link
        to={to}
        onClick={(e) => e.stopPropagation()}
        sx={{ variant: 'links.nav', fontSize: 1, borderBottom: 'none', '&:hover': { textDecoration: 'underline' } }}>
        {label}
      </Link>
    )
    return (
      <Card
        onClick={this.props.goToConversation}
        data-test-id="conversation-card"
        sx={{ cursor: 'pointer', overflowWrap: 'anywhere', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}
        key={this.props.i}>
        <Flex sx={{ alignItems: 'flex-start', gap: 2 }}>
          <Text sx={{ fontWeight: 'bold', fontSize: 3, lineHeight: 'heading', flex: 1, minWidth: 0 }}>
            {c.topic || 'Untitled conversation'}
          </Text>
          <Text
            sx={{
              flexShrink: 0,
              fontSize: 0,
              fontWeight: 'bold',
              px: 2,
              py: '2px',
              borderRadius: 'pill',
              bg: open ? '#dcfce7' : 'secondary',
              color: open ? '#166534' : 'muted'
            }}>
            {open ? 'Open' : 'Closed'}
          </Text>
        </Flex>
        {c.description ? (
          <Text
            sx={{
              color: 'muted',
              fontSize: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
            {c.description}
          </Text>
        ) : null}
        <Text sx={{ fontSize: 1, color: 'muted' }}>
          {c.participant_count} {c.participant_count === 1 ? 'participant' : 'participants'}
          {c.parent_url ? (
            <span data-test-id="embed-page"> · embedded on {c.parent_url}</span>
          ) : null}
        </Text>
        <Flex sx={{ gap: 3, mt: 'auto', pt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {link(base, 'Set up')}
          {link(`${base}/comments`, 'Moderate')}
          {link(`${base}/results`, 'Results')}
          <a
            href={Url.urlPrefix + c.conversation_id}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            sx={{ fontSize: 1, ml: 'auto', color: 'muted' }}>
            Voting page ↗
          </a>
        </Flex>
      </Card>
    )
  }
}

Conversation.propTypes = {
  c: PropTypes.shape({
    conversation_id: PropTypes.string,
    topic: PropTypes.string,
    description: PropTypes.string,
    parent_url: PropTypes.string,
    participant_count: PropTypes.number,
    is_active: PropTypes.bool
  }),
  i: PropTypes.number.isRequired,
  goToConversation: PropTypes.func.isRequired
}

export default Conversation
