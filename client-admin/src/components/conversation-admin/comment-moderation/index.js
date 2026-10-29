// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
/** @jsx jsx */

import ComponentHelpers from '../../../util/component-helpers'

import NoPermission from '../no-permission'
import React from 'react'
import { connect } from 'react-redux'
import { populateAllCommentStores } from '../../../actions'
import { Heading, Flex, Box, jsx } from 'theme-ui'

import ModerateCommentsTodo from './moderate-comments-todo'
import ModerateCommentsAccepted from './moderate-comments-accepted'
import ModerateCommentsRejected from './moderate-comments-rejected'

import { Switch, Route, Link } from 'react-router-dom'

const mapStateToProps = (state, ownProps) => {
  return {
    unmoderated: state.mod_comments_unmoderated,
    accepted: state.mod_comments_accepted,
    rejected: state.mod_comments_rejected,
    seed: state.seed_comments
  }
}

const pollFrequency = 60000

@connect((state) => state.zid_metadata)
@connect(mapStateToProps)
class CommentModeration extends React.Component {
  loadComments() {
    const { match } = this.props
    this.props.dispatch(populateAllCommentStores(match.params.conversation_id))
  }

  componentWillMount() {
    this.getCommentsRepeatedly = setInterval(() => {
      this.loadComments()
    }, pollFrequency)
  }

  componentDidMount() {
    this.loadComments()
  }

  componentWillUnmount() {
    clearInterval(this.getCommentsRepeatedly)
  }

  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }
    const { match, location } = this.props

    const url = location.pathname.split('/')[4]

    const tabs = [
      ['', 'To review', this.props.unmoderated.unmoderated_comments, !url],
      ['/accepted', 'Accepted', this.props.accepted.accepted_comments, url === 'accepted'],
      ['/rejected', 'Rejected', this.props.rejected.rejected_comments, url === 'rejected']
    ]
    return (
      <Box>
        <Flex sx={{ mb: 3, gap: 1, bg: 'secondary', borderRadius: 'pill', p: 1, width: 'fit-content', maxWidth: '100%' }}>
          {tabs.map(([suffix, label, list, on]) => (
            <Link
              key={label}
              to={`${match.url}${suffix}`}
              sx={{
                textDecoration: 'none',
                fontSize: 1,
                fontWeight: 'bold',
                px: 3,
                py: 2,
                borderRadius: 'pill',
                whiteSpace: 'nowrap',
                color: on ? 'surface' : 'text',
                bg: on ? 'primary' : 'transparent',
                '&:hover': { color: on ? 'surface' : 'primary' }
              }}>
              {label}
              {list ? <span sx={{ ml: 1, opacity: 0.8 }}>{list.length}</span> : null}
            </Link>
          ))}
        </Flex>
        <Box>
          <Switch>
            <Route
              exact
              path={`${match.url}`}
              component={ModerateCommentsTodo}
            />
            <Route
              exact
              path={`${match.url}/accepted`}
              component={ModerateCommentsAccepted}
            />
            <Route
              exact
              path={`${match.url}/rejected`}
              component={ModerateCommentsRejected}
            />
          </Switch>
        </Box>
      </Box>
    )
  }
}

export default CommentModeration
