// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>

/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { handleZidMetadataUpdate, optimisticZidMetadataUpdateOnTyping } from '../../actions'
import ComponentHelpers from '../../util/component-helpers'
import NoPermission from './no-permission'
import { Box, Text, Flex, Button, jsx } from 'theme-ui'

import { CheckboxField } from './CheckboxField'
import ModerateCommentsSeed from './seed-comment'
import SeedCommentsCsv from './seed-comment-csv'
import DraftStatementsAi from './draft-statements-ai'
import Section from '../framework/section'
import ConfirmDialog from '../framework/confirm-dialog'
import PolisNet from '../../util/net'

const Label = ({ htmlFor, children }) => (
  <Text as="label" htmlFor={htmlFor} sx={{ display: 'block', fontSize: 1, fontWeight: 'bold', mb: 1 }}>
    {children}
  </Text>
)

@connect((state) => state.user)
@connect((state) => state.zid_metadata)
class ConversationConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = { openDelete: false }
  }

  handleStringValueChange(field) {
    return () => {
      let val = this[field].value
      if (field === 'help_bgcolor' || field === 'help_color') {
        if (!val.length) {
          val = 'default'
        }
      }
      this.props.dispatch(handleZidMetadataUpdate(this.props.zid_metadata, field, val))
    }
  }

  handleConfigInputTyping(field) {
    return (e) => {
      this.props.dispatch(optimisticZidMetadataUpdateOnTyping(this.props.zid_metadata, field, e.target.value))
    }
  }

  deleteConversation = () => {
    PolisNet.polisDelete('/api/v3/conversation', {
      conversation_id: this.props.zid_metadata.conversation_id
    }).then(() => {
      window.location.href = '/'
    })
  }

  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }
    const cid = this.props.zid_metadata.conversation_id

    return (
      <Box>
        <Flex sx={{ justifyContent: 'flex-end', mb: 2, minHeight: '1.5em' }}>
          <Text sx={{ fontSize: 0, color: this.props.error ? 'red' : 'muted' }} data-test-id="save-state">
            {this.props.error ? 'Could not save' : this.props.loading ? 'Saving…' : 'All changes saved'}
          </Text>
        </Flex>

        <Section title="Basics" intro="What participants see at the top of the voting page.">
          <Box sx={{ mb: 3 }}>
            <Label htmlFor="topic">Title</Label>
            <input
              id="topic"
              ref={(c) => (this.topic = c)}
              sx={{ variant: 'forms.input', maxWidth: 'none' }}
              data-test-id="topic"
              onBlur={this.handleStringValueChange('topic').bind(this)}
              onChange={this.handleConfigInputTyping('topic').bind(this)}
              defaultValue={this.props.zid_metadata.topic}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              ref={(c) => (this.description = c)}
              sx={{ variant: 'forms.textarea', maxWidth: 'none', height: '6em' }}
              data-test-id="description"
              onBlur={this.handleStringValueChange('description').bind(this)}
              onChange={this.handleConfigInputTyping('description').bind(this)}
              defaultValue={this.props.zid_metadata.description}
            />
          </Box>
          <CheckboxField field="is_active" label="Conversation Is Open">
            Open: participants can vote and write. Unchecking closes the conversation.
          </CheckboxField>
        </Section>

        <Section
          title="Statements"
          intro="Seed statements participants vote on from the start. One per line in the box, a CSV from Citizens, or drafts from the AI assistant.">
          <ModerateCommentsSeed params={{ conversation_id: cid }} />
          <SeedCommentsCsv params={{ conversation_id: cid }} />
          <Box sx={{ borderTop: '1px solid', borderTopColor: 'border', pt: 3, mt: 1 }}>
            <Text sx={{ fontWeight: 'bold', fontSize: 1, mb: 2 }}>Draft statements with AI</Text>
            <DraftStatementsAi params={{ conversation_id: cid }} />
          </Box>
        </Section>

        <Section title="Participants can…" intro="What the voting page shows and allows.">
          <CheckboxField field="write_type" label="Comment form" isIntegerBool>
            Write their own statements
          </CheckboxField>
          <CheckboxField field="vis_type" label="Visualization" isIntegerBool>
            See the opinion groups
          </CheckboxField>
          <CheckboxField field="help_type" label="Help text" isIntegerBool>
            Read the explanation text above voting and the groups
          </CheckboxField>
        </Section>

        <Section title="Moderation and access" intro="Who can take part, and whether new statements wait for approval.">
          <CheckboxField field="strict_moderation">
            New statements are shown only after a moderator approves them
          </CheckboxField>
          <CheckboxField field="auth_needed_to_vote" label="Login required to vote">
            Login required to vote
          </CheckboxField>
          <CheckboxField field="auth_needed_to_write" label="Login required to comment">
            Login required to write statements
          </CheckboxField>
        </Section>

        <Section title="Delete" intro="Removes the conversation, its statements and votes. This cannot be undone." danger>
          <Button variant="secondary" data-test-id="delete-conversation" onClick={() => this.setState({ openDelete: true })}>
            Delete this conversation
          </Button>
          <ConfirmDialog
            open={this.state.openDelete}
            title="Delete this conversation?"
            confirmLabel="Delete"
            onCancel={() => this.setState({ openDelete: false })}
            onConfirm={this.deleteConversation}>
            “{this.props.zid_metadata.topic}” and all its statements and votes will be deleted.
          </ConfirmDialog>
        </Section>
      </Box>
    )
  }
}

export default ConversationConfig
