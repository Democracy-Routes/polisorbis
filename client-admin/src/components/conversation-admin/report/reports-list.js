// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import PolisNet from '../../../util/net'
import React from 'react'
import PropTypes from 'prop-types'
import Url from '../../../util/url'
import { connect } from 'react-redux'
import { Heading, Box, Button, Text } from 'theme-ui'
import ComponentHelpers from '../../../util/component-helpers'
import NoPermission from '../no-permission'

@connect((state) => state.zid_metadata)
class ReportsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      reports: []
    }
  }

  getData() {
    const { match } = this.props
    const reportsPromise = PolisNet.polisGet('/api/v3/reports', {
      conversation_id: match.params.conversation_id
    })
    reportsPromise.then((reports) => {
      this.setState({
        loading: false,
        reports: reports
      })
    })
  }

  componentDidMount() {
    const { zid_metadata } = this.props

    if (zid_metadata.is_mod) {
      this.getData()
    }
  }

  createReportClicked() {
    const { match } = this.props
    PolisNet.polisPost('/api/v3/reports', {
      conversation_id: match.params.conversation_id
    }).then(() => {
      this.getData()
    })
  }

  render() {
    if (ComponentHelpers.shouldShowPermissionsError(this.props)) {
      return <NoPermission />
    }

    if (this.state.loading) {
      return <div>Loading Reports...</div>
    }
    return (
      <Box>
        {this.props.embedded ? null : (
          <Heading as="h3" sx={{ fontSize: [3, null, 4], lineHeight: 'body', mb: [3, null, 4] }}>
            Report
          </Heading>
        )}
        {this.state.reports.map((report) => (
          <Box sx={{ mb: 2 }} key={report.report_id}>
            <a target="_blank" rel="noreferrer" href={Url.urlPrefix + 'report/' + report.report_id}>
              Open the report ↗
            </a>
            <Text sx={{ fontSize: 0, color: 'muted', overflowWrap: 'anywhere' }}>
              {Url.urlPrefix}report/{report.report_id}
            </Text>
          </Box>
        ))}
        {this.state.reports.length ? null : (
          <Text sx={{ fontSize: 1, color: 'muted', mb: 2 }}>No report link yet.</Text>
        )}
        <Button variant={this.state.reports.length ? 'secondary' : 'primary'} onClick={this.createReportClicked.bind(this)}>
          {this.state.reports.length ? 'Create another report link' : 'Create the report link'}
        </Button>
      </Box>
    )
  }
}

ReportsList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      conversation_id: PropTypes.string
    })
  }),
  embedded: PropTypes.bool,
  zid_metadata: PropTypes.shape({
    is_mod: PropTypes.bool
  })
}

export default ReportsList
