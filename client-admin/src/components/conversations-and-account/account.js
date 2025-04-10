// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Box, Heading } from 'theme-ui'

import Spinner from '../framework/spinner'

const pOpenidEnabled = process.env.P_OPENID_ENABLED;
const pOpenidProviderName = process.env.P_OPENID_PROVIDER_NAME;
const pOpenidProfilePageURL = process.env.P_OPENID_PROFILE_PAGE_URL;

@connect((state) => state.user)
class Account extends React.Component {
    buildAccountMarkup() {
        return (
            <>
                <Box>
                    <Heading
                        as="h3"
                        sx={{
                            fontSize: [3, null, 4],
                            lineHeight: 'body',
                            mb: [3, null, 4]
                        }}>
                        Account
                    </Heading>
                    {
                        pOpenidEnabled ? (
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href={pOpenidProfilePageURL}>
                                Go to {pOpenidProviderName} profile
                            </a>
                        ) : (
                            <>
                                <p>Hi {this.props.user.hname.split(' ')[0]}!</p>
                                <Box>
                                    <p>{this.props.user.hname}</p>
                                    <p>{this.props.user.email}</p>
                                    <p>Social:</p>
                                    <p>{this.props.user.hasFacebook ? 'Facebook is connected' : ''} </p>
                                    <p>{this.props.user.hasTwitter ? 'Twitter is connected' : ''}</p>
                                    <p>{this.props.user.hasOpenID ? 'OpenID is connected' : ''}</p>
                                </Box>
                            </>
                        )
                    }
                </Box >
            </>
        )
    }

    render() {
        return (
            <div>
                {this.props.user.hname ? this.buildAccountMarkup() : <Spinner />}
            </div>
        )
    }
}

Account.propTypes = {
    user: PropTypes.shape({
        hname: PropTypes.string,
        email: PropTypes.string,
        hasFacebook: PropTypes.bool,
        hasTwitter: PropTypes.bool,
        hasOpenID: PropTypes.bool
    })
}

export default Account
