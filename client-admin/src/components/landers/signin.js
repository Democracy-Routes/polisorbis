// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { doSignin, doFacebookSignin } from '../../actions'
import { Link, Redirect } from 'react-router-dom'
import { Heading, Box, Text, Button, jsx, Card } from 'theme-ui'
import StaticLayout from './lander-layout'
import crypto from 'crypto'

import strings from '../../strings/strings'


const fbAppId = process.env.FB_APP_ID

const openidEnabled = process.env.P_OPENID_ENABLED;
const openidProviderName = process.env.P_OPENID_PROVIDER_NAME;

const votingCertificateEnabled = false;

const digitalWalletEnabled = false;

@connect((state) => state.signin)
class SignIn extends React.Component {
    // eslint-disable-next-line node/handle-callback-err
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidMount() {
        this.props.dispatch({ type: 'signin reset state' })
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo)
    }

    // getDest() {
    //   return this.props.location.pathname.slice("/signin".length);
    // }

    handleLoginClicked(e) {
        e.preventDefault()
        const hash = crypto.createHash('md5').update(this.email.value).digest('hex');
        const attrs = {
            email: `${hash}@dummy.net`,
            password: this.password.value
        }

        // var dest = this.getDest();
        // if (!dest.length) {
        //   dest = "/";
        // }
        this.props.dispatch(doSignin(attrs))
    }

    facebookButtonClicked() {
        let dest = this.getDest()
        if (!dest.length) {
            dest = '/'
        }
        this.props.dispatch(doFacebookSignin(dest))
    }

    handleFacebookPasswordSubmit() {
        let dest = this.getDest()
        if (!dest.length) {
            dest = '/'
        }
        const optionalPassword = this.facebook_password.value
        this.props.dispatch(doFacebookSignin(dest, optionalPassword))
    }

    maybeErrorMessage() {
        let markup = ''
        if (this.props.error) {
            markup = <div>{strings(this.props.error.responseText)}</div>
        }
        return markup
    }

    drawLoginForm() {
        return (
            <Box>
                {!(openidEnabled || votingCertificateEnabled || digitalWalletEnabled) && (
                    <form>
                        <Box sx={{ my: [2] }}>
                            <label htmlFor="signinEmailInput" sx={{ display: 'block', fontSize: [1], mb: 1 }}>Email</label>
                            <input
                                sx={{
                                    fontFamily: 'body',
                                    fontSize: [2],
                                    width: '100%',
                                    maxWidth: '35em',
                                    borderRadius: 2,
                                    padding: [2],
                                    border: '1px solid',
                                    borderColor: 'mediumGray'
                                }}
                                id="signinEmailInput"
                                ref={(c) => (this.email = c)}
                                placeholder="you@example.org"
                                type="text"
                            />
                        </Box>
                        <Box sx={{ my: [2] }}>
                            <label htmlFor="signinPasswordInput" sx={{ display: 'block', fontSize: [1], mb: 1 }}>Password</label>
                            <input
                                sx={{
                                    fontFamily: 'body',
                                    fontSize: [2],
                                    width: '100%',
                                    maxWidth: '35em',
                                    borderRadius: 2,
                                    padding: [2],
                                    border: '1px solid',
                                    borderColor: 'mediumGray'
                                }}
                                id="signinPasswordInput"
                                ref={(c) => (this.password = c)}
                                placeholder="password"
                                type="password"
                            />
                        </Box>
                        {this.maybeErrorMessage()}
                        <Button
                            sx={{ my: [2], width: ['100%', 'auto'] }}
                            id="signinButton"
                            onClick={this.handleLoginClicked.bind(this)}>
                            {this.props.pending ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                )}
                {fbAppId && (
                    <Box sx={{ my: 4 }}>
                        <Button
                            id="facebookSigninButton"
                            onClick={this.facebookButtonClicked.bind(this)}>
                            Sign in with Facebook
                        </Button>
                    </Box>
                )}
                {openidEnabled && (
                    <>
                        <Button
                            sx={{ my: [2] }}
                            id="signinOpenIDButton"
                            onClick={() => {
                                // window.top.postMessage("twitterConnectBegin", "*");


                                // open a new window where the twitter auth screen will show.
                                // that window will redirect back to a simple page that calls window.opener.twitterStatus("ok")

                                // var params = 'location=0,status=0,width=800,height=400';
                                // window.open(document.location.origin + "/api/v3/openidBtn?dest=/twitterAuthReturn/ParticipationView", 'twitterWindow', params);

                                var dest = window.location.pathname + window.location.hash;
                                window.location = "/api/v3/openidBtn?dest=" + "/";
                            }}>
                            Sign in with {openidProviderName}
                        </Button>
                    </>
                )}
                {votingCertificateEnabled && (
                    <>
                        <Button
                            sx={{ my: [2] }}
                            id="signinVotingCertificateButton"
                            onClick={() => {

                            }}>
                            Sign in with Anonymous Voting Certificate
                        </Button>
                    </>
                )}
                {digitalWalletEnabled && (
                    <>
                        <Button
                            sx={{ my: [2] }}
                            id="signinDigitalWalletButton"
                            onClick={() => {

                            }}>
                            Sign in with Digital Identity Wallet
                        </Button>
                    </>
                )}
                <Text>
                    If you Sign in you agree to the terms and privacy policy
                </Text>
            </Box>
        )
    }

    drawPasswordConnectFacebookForm() {
        return (
            <span>
                <p>
                    {
                        'A pol.is user already exists with the email address associated with this Facebook account.'
                    }
                </p>
                <p>
                    {
                        'Please enter the password to your pol.is account to enable Facebook login.'
                    }
                </p>
                <input
                    ref={(c) => (this.facebook_password = c)}
                    placeholder="polis password"
                    type="password"
                />
                <button onClick={this.handleFacebookPasswordSubmit.bind(this)}>
                    {'Connect Facebook Account'}
                </button>
            </span>
        )
    }

    render() {
        const { signInSuccessful, authed } = this.props

        if (signInSuccessful || authed) {
            return <Redirect to={'/'} />
        }

        return (
            <StaticLayout>
              <Box sx={{ maxWidth: '28em', mx: 'auto' }}>
                <Heading as="h1" sx={{ my: [4, null, 5], fontSize: [5, null, 6] }}>
                    Sign in
                </Heading>
                <Card>
                    {this.props.facebookError !== 'polis_err_user_with_this_email_exists'
                        ? this.drawLoginForm()
                        : this.drawPasswordConnectFacebookForm()}
                </Card>
              </Box>
            </StaticLayout>
        )
    }
}

export default SignIn
