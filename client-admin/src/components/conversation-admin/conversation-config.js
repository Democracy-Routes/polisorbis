// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import {
  handleZidMetadataUpdate,
  optimisticZidMetadataUpdateOnTyping
} from '../../actions'
import ComponentHelpers from '../../util/component-helpers'
import NoPermission from './no-permission'
import { Heading, Box, Text, Flex, jsx } from 'theme-ui'
import emoji from 'react-easy-emoji'

import { CheckboxField } from './CheckboxField'
import ModerateCommentsSeed from './seed-comment'
// import ModerateCommentsSeedTweet from "./seed-tweet";

@connect((state) => state.user)
@connect((state) => state.zid_metadata)
class ConversationConfig extends React.Component {
  handleStringValueChange(field) {
    return () => {
      let val = this[field].value
      if (field === 'help_bgcolor' || field === 'help_color') {
        if (!val.length) {
          val = 'default'
        }
      }
      this.props.dispatch(
        handleZidMetadataUpdate(this.props.zid_metadata, field, val)
      )
    }
  }

  handleConfigInputTyping(field) {
    return (e) => {
      this.props.dispatch(
        optimisticZidMetadataUpdateOnTyping(
          this.props.zid_metadata,
          field,
          e.target.value
        )
      )
    }
  }

  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }

    return (
      <Box>
        <Heading
          as="h3"
          sx={{
            fontSize: [3, null, 4],
            lineHeight: 'body',
            mb: [3, null, 4]
          }}>
          Configure
        </Heading>
        <Box sx={{ mb: [4] }}>
          {this.props.loading ? (
            <Text>{emoji('💾')} Saving</Text>
          ) : (
            <Text>{emoji('⚡')} Up to date</Text>
          )}
          {this.props.error ? <Text>Error Saving</Text> : null}
        </Box>

        <CheckboxField field="is_active" label="Conversation Is Open">
          Conversation is open. Unchecking disables both voting and commenting.
        </CheckboxField>

        <Box sx={{ mb: [3] }}>
          <Text sx={{ mb: [2] }}>Topic</Text>
          <input
            ref={(c) => (this.topic = c)}
            sx={{
              fontFamily: 'body',
              fontSize: [2],
              width: '35em',
              borderRadius: 2,
              padding: [2],
              border: '1px solid',
              borderColor: 'mediumGray'
            }}
            data-test-id="topic"
            onBlur={this.handleStringValueChange('topic').bind(this)}
            onChange={this.handleConfigInputTyping('topic').bind(this)}
            defaultValue={this.props.zid_metadata.topic}
          />
        </Box>

        <Box sx={{ mb: [3] }}>
          <Text sx={{ mb: [2] }}>Description</Text>
          <textarea
            ref={(c) => (this.description = c)}
            sx={{
              fontFamily: 'body',
              fontSize: [2],
              width: '35em',
              height: '7em',
              resize: 'none',
              padding: [2],
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'mediumGray'
            }}
            data-test-id="description"
            onBlur={this.handleStringValueChange('description').bind(this)}
            onChange={this.handleConfigInputTyping('description').bind(this)}
            defaultValue={this.props.zid_metadata.description}
          />
        </Box>

        <Heading
          as="h6"
          sx={{
            fontSize: [1, null, 2],
            lineHeight: 'body',
            my: [3, null, 4]
          }}>
          Seed Comments
        </Heading>
        <ModerateCommentsSeed
          params={{ conversation_id: this.props.zid_metadata.conversation_id }}
        />

        {/* <ModerateCommentsSeedTweet
          params={{ conversation_id: this.props.zid_metadata.conversation_id }}
        /> */}

        <Heading
          as="h6"
          sx={{
            fontSize: [1, null, 2],
            lineHeight: 'body',
            my: [3, null, 4]
          }}>
          Customize the user interface
        </Heading>

        <CheckboxField field="vis_type" label="Visualization" isIntegerBool>
          Participants can see the visualization
        </CheckboxField>

        <CheckboxField field="write_type" label="Comment form" isIntegerBool>
          Participants can submit comments
        </CheckboxField>

        <CheckboxField field="help_type" label="Help text" isIntegerBool>
          Show explanation text above voting and visualization
        </CheckboxField>

        {/* Tis Option is disabled for GDPR concern..
		<CheckboxField
          field="subscribe_type"
          label="Prompt participants to subscribe to updates"
          isIntegerBool>
          Prompt participants to subscribe to updates. A prompt is shown to
          users once they finish voting on all available comments. If enabled,
          participants may optionally provide their email address to receive
          notifications when there are new comments to vote on. 
        </CheckboxField> 
		*/}

        <CheckboxField
          sx={{ mt: [3] }}
          field="required_certificate"
          label="Request certificate">
          Request voting certificate

          <CheckboxField
            field="certificate_anonymous"
            label="Anonymous certificate">
            Anonymous
          </CheckboxField>
          <CheckboxField
            field="certificate_identified"
            label="Identified certificate">
            Identified
          </CheckboxField>
          <Flex sx={{ gap: [3] }}>
            <CheckboxField
              field="certificate_endpoint"
              label="Authorized by endpoint certificate">
              Authorized by endpoint
            </CheckboxField>
            <input
              ref={(c) => (this.certificateEndpoint = c)}
              sx={{
                fontFamily: 'body',
                fontSize: [2],
                width: '9em',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'mediumGray'
              }}
              data-test-id="certificateEndpoint"
              onBlur={this.handleStringValueChange('certificateEndpoint').bind(this)}
              onChange={this.handleConfigInputTyping('certificateEndpoint').bind(this)}
              defaultValue={this.props.zid_metadata.certificateEndpoint}
            />
          </Flex>
        </CheckboxField>

        <CheckboxField
          sx={{ mt: [3] }}
          field="auth_with_openid"
          label="Auth with OpenId">
          Login with Open Id Connect

          <Flex sx={{ gap: [3] }}>
            <Text>
              Identity provider
            </Text>
            <input
              ref={(c) => (this.identityProvider = c)}
              sx={{
                fontFamily: 'body',
                fontSize: [2],
                width: '9em',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'mediumGray'
              }}
              data-test-id="identityProvider"
              onBlur={this.handleStringValueChange('identityProvider').bind(this)}
              onChange={this.handleConfigInputTyping('identityProvider').bind(this)}
              defaultValue={this.props.zid_metadata.identityProvider}
            />
          </Flex>
          
        </CheckboxField>
        
        {/* <CheckboxField field="auth_opt_fb" label="Facebook login prompt">
          Show Facebook login prompt
        </CheckboxField>

        <CheckboxField field="auth_opt_tw" label="Twitter login prompt">
          Show Twitter login prompt
        </CheckboxField> */}

        

        <Heading
          as="h6"
          sx={{
            fontSize: [1, null, 2],
            lineHeight: 'body',
            my: [3, null, 4]
          }}>
          Schemes
        </Heading>

        <CheckboxField field="strict_moderation">
          No comments shown without moderator approval
        </CheckboxField>

        <CheckboxField
          field="auth_needed_to_write"
          label="Require Certificate to Comment">
          Participants cannot submit comments without voting certificate
        </CheckboxField>

        <CheckboxField field="cert_needed_to_write" label="Require Identification to Comment">
          Participants cannot submit comments without identification (login or voting certificate)
        </CheckboxField>
      </Box>
    )
  }
}

export default ConversationConfig

// checked={this.props.zid_metadata.is_data_open}
// Comments, votes, and group data can be exported by any user

/* <InputField
            ref={"style_btn"}

            style={{ width: 360 }}
            onBlur={this.handleStringValueChange("style_btn").bind(this)}
            hintText="ie., #e63082"
            onChange={this.handleConfigInputTyping("style_btn")}
            value={this.props.zid_metadata.style_btn}
            floatingLabelText={
              "Customize submit button color" + (canCustomizeColors ? "" : lockedIcon)
            }
            multiLine={true}
          /> */

/* <InputField
            ref={"help_bgcolor"}

            style={{ width: 360 }}
            onBlur={this.handleStringValueChange("help_bgcolor").bind(this)}
            onChange={this.handleConfigInputTyping("help_bgcolor")}
            value={this.props.zid_metadata.help_bgcolor}
            hintText="ie., #e63082"
            floatingLabelText={
              "Customize help text background" + (canCustomizeColors ? "" : lockedIcon)
            }
            multiLine={true}
          /> */

/* <InputField
            ref={"help_color"}

            style={{ width: 360 }}
            onBlur={this.handleStringValueChange("help_color").bind(this)}
            onChange={this.handleConfigInputTyping("help_color")}
            value={this.props.zid_metadata.help_color}
            hintText="ie., #e63082"
            floatingLabelText={"Customize help text color" + (canCustomizeColors ? "" : lockedIcon)}
            multiLine={true}
          /> */

/* <Checkbox
            label="Social sharing buttons"
            ref={"socialbtn_type"}
            checked={this.props.zid_metadata.socialbtn_type === 1 ? true : false}
            onCheck={this.handleIntegerBoolValueChange("socialbtn_type").bind(this)}


          /> */
