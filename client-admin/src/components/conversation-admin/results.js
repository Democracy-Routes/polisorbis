// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// Results: the public link, the live numbers and the report links, which
// used to be three separate pages (Distribute, Monitor, Report).

/** @jsx jsx */
import React from 'react'
import { connect } from 'react-redux'
import { jsx } from 'theme-ui'

import ComponentHelpers from '../../util/component-helpers'
import NoPermission from './no-permission'
import Section from '../framework/section'
import ShareAndEmbed from './share-and-embed'
import ConversationStats from './stats'
import ReportsList from './report/reports-list'

@connect((state) => state.zid_metadata)
class Results extends React.Component {
  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }
    const { match } = this.props
    return (
      <div>
        <Section title="Share" intro="Send this link to participants, or put it on a web page.">
          <ShareAndEmbed match={match} embedded />
        </Section>
        <Section title="Live numbers" intro="Updated every ten seconds while this page is open.">
          <ConversationStats match={match} embedded />
        </Section>
        <Section title="Report" intro="The analysis page: majority, opinion groups, the map. Anyone with the link can read it.">
          <ReportsList match={match} embedded />
        </Section>
      </div>
    )
  }
}

export default Results
