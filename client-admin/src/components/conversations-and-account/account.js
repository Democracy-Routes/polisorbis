// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Box, Heading, Text } from 'theme-ui'

import Spinner from '../framework/spinner'

const pOpenidEnabled = process.env.P_OPENID_ENABLED;
const pOpenidProviderName = process.env.P_OPENID_PROVIDER_NAME;
const pOpenidProfilePageURL = process.env.P_OPENID_PROFILE_PAGE_URL;

@connect((state) => state.user)
class Account extends React.Component {
    buildAccountMarkup() {
        const u = this.props.user
        return (
            <Box>
                <Heading as="h1" sx={{ fontSize: [4, 5], lineHeight: 'heading', mb: [3, 4] }}>
                    Account
                </Heading>
                <Box sx={{ variant: 'cards.primary', p: [3, 4], maxWidth: '36em' }}>
                    {pOpenidEnabled ? (
                        <a target="_blank" rel="noreferrer" href={pOpenidProfilePageURL}>
                            Go to {pOpenidProviderName} profile
                        </a>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '8em 1fr', rowGap: 2, fontSize: 1 }}>
                            <Text sx={{ color: 'muted' }}>Name</Text>
                            <Text>{u.hname}</Text>
                            <Text sx={{ color: 'muted' }}>Email</Text>
                            <Text sx={{ overflowWrap: 'anywhere' }}>{u.email}</Text>
                            {u.hasFacebook || u.hasTwitter || u.hasOpenID ? (
                                <>
                                    <Text sx={{ color: 'muted' }}>Connected</Text>
                                    <Text>
                                        {[u.hasFacebook && 'Facebook', u.hasTwitter && 'Twitter', u.hasOpenID && 'OpenID'].filter(Boolean).join(', ')}
                                    </Text>
                                </>
                            ) : null}
                        </Box>
                    )}
                </Box>
            </Box>
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
