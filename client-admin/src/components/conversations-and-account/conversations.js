// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    populateConversationsStore,
    handleCreateConversationSubmit
} from '../../actions'

import Url from '../../util/url'
import { Box, Flex, Heading, Button, Text } from 'theme-ui'
import Conversation from './conversation'

@connect((state) => state.conversations)
class Conversations extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterMinParticipantCount: 0,
            sort: 'participant_count'
        }
    }

    onNewClicked() {
        this.props.dispatch(handleCreateConversationSubmit())
    }

    componentDidMount() {
        this.props.dispatch(populateConversationsStore())
        // loading true or just do that in constructor
        // check your connectivity and try again
    }

    goToConversation = (conversation_id) => {
        return () => {
            if (this.props.history.pathname === 'other-conversations') {
                window.open(`${Url.urlPrefix}${conversation_id}`, '_blank')
                return
            }
            this.props.history.push(`/m/${conversation_id}`)
        }
    }

    filterCheck(c) {
        let include = true

        if (c.participant_count < this.state.filterMinParticipantCount) {
            include = false
        }

        if (this.props.history.pathname === 'other-conversations') {
            // filter out conversations i do own
            include = !c.is_owner
        }

        if (this.props.history.pathname !== 'other-conversations' && !c.is_owner) {
            // if it's not other convos and i'm not the owner, don't show it
            // filter out convos i don't own
            include = false
        }

        return include
    }

    firePopulateInboxAction() {
        this.props.dispatch(populateConversationsStore())
    }

    onFilterChange() {
        this.setState()
    }

    render() {
        const err = this.props.error
        const { conversations } = this.props

        const own = conversations ? conversations.filter((c) => this.filterCheck(c)) : []
        return (
            <Box>
                <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 3, mb: [3, 4], flexWrap: 'wrap' }}>
                    <Heading as="h1" sx={{ fontSize: [4, 5], lineHeight: 'heading' }}>
                        Conversations
                    </Heading>
                    <Button onClick={this.onNewClicked.bind(this)} data-test-id="create-conversation">
                        New conversation
                    </Button>
                </Flex>
                {this.props.loading ? <Text sx={{ color: 'muted' }}>Loading conversations…</Text> : null}
                {err ? (
                    <Text sx={{ color: 'red' }}>
                        {'Error loading conversations: ' + err.status + ' ' + err.statusText}
                    </Text>
                ) : null}
                {conversations && !own.length && !this.props.loading ? (
                    <Text sx={{ color: 'muted' }}>No conversations yet. Create one to get a voting page and a report.</Text>
                ) : null}
                <Box sx={{ display: 'grid', gridTemplateColumns: ['1fr', null, '1fr 1fr'], gap: 3, alignItems: 'stretch' }}>
                    {own.map((c, i) => (
                        <Conversation
                            key={c.conversation_id}
                            c={c}
                            i={i}
                            goToConversation={this.goToConversation(c.conversation_id)}
                        />
                    ))}
                </Box>
            </Box>
        )
    }
}

Conversations.propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.shape({
        status: PropTypes.number,
        statusText: PropTypes.string
    }),
    loading: PropTypes.bool,
    conversations: PropTypes.arrayOf(
        PropTypes.shape({
            conversation_id: PropTypes.string
        })
    ),
    history: PropTypes.shape({
        pathname: PropTypes.string,
        push: PropTypes.func
    })
}

export default Conversations
