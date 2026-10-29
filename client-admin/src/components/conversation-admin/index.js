// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
/** @jsx jsx */

import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, Button, Text, jsx } from 'theme-ui'
import { populateZidMetadataStore, resetMetadataStore } from '../../actions'
import { Switch, Route, Link } from 'react-router-dom'

import ConversationConfig from './conversation-config'
import ConversationStats from './stats'

import ModerateComments from './comment-moderation/'

// import DataExport from "./data-export";
import ShareAndEmbed from './share-and-embed'

import Reports from './report/reports'

import PolisNet from '../../util/net'

@connect((state) => state.zid_metadata)
class ConversationAdminContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openDelete: false
        }
    }

    loadZidMetadata() {
        this.props.dispatch(
            populateZidMetadataStore(this.props.match.params.conversation_id)
        )
    }

    resetMetadata() {
        this.props.dispatch(resetMetadataStore())
    }

    componentWillMount() {
        this.loadZidMetadata()
    }

    componentWillUnmount() {
        this.resetMetadata()
    }

    componentDidUpdate() {
        this.loadZidMetadata()
    }

    onButtonClicked(state) {
        this.setState({openDelete: state})
    }

    deleteConversation = () => {
        PolisNet.polisDelete('/api/v3/conversation', {
            conversation_id: this.props.match.params.conversation_id
        }).then(() => {
            window.location.href = "/"
        })
    }

    render() {
        const { match, location } = this.props

        const url = location.pathname.split('/')[3]

        return (
            <Flex sx={{ flexDirection: ['column', 'row'], maxWidth: '72em', mx: 'auto', width: '100%' }}>
                <Flex
                    sx={{
                        flexDirection: ['row', 'column'],
                        flexWrap: ['nowrap', 'wrap'],
                        overflowX: ['auto', 'visible'],
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        whiteSpace: ['nowrap', 'normal'],
                        mr: [0, 5],
                        px: [3, 4],
                        pt: [3, 4],
                        pb: [0, 4],
                        flex: ['0 0 auto', '0 0 180px'],
                        '& > div': { flexShrink: 0, mr: [4, 0] }
                    }}>
                    <Box sx={{ mb: [3] }}>
                        <Link sx={{ variant: 'links.nav' }} to={`/`}>
                            All
                        </Link>
                    </Box>
                    <Box sx={{ mb: [3] }}>
                        <Link
                            sx={{ variant: url ? 'links.nav' : 'links.activeNav' }}
                            to={`${match.url}`}>
                            Configure
                        </Link>
                    </Box>
                    <Box sx={{ mb: [3] }}>
                        <Link
                            sx={{
                                variant: url === 'share' ? 'links.activeNav' : 'links.nav'
                            }}
                            to={`${match.url}/share`}>
                            Distribute
                        </Link>
                    </Box>
                    <Box sx={{ mb: [3] }}>
                        <Link
                            sx={{
                                variant: url === 'comments' ? 'links.activeNav' : 'links.nav'
                            }}
                            to={`${match.url}/comments`}>
                            Moderate
                        </Link>
                    </Box>
                    <Box sx={{ mb: [3] }}>
                        <Link
                            sx={{
                                variant: url === 'stats' ? 'links.activeNav' : 'links.nav'
                            }}
                            to={`${match.url}/stats`}>
                            Monitor
                        </Link>
                    </Box>
                    <Box sx={{ mb: [3] }}>
                        <Link
                            sx={{
                                variant: url === 'reports' ? 'links.activeNav' : 'links.nav'
                            }}
                            to={`${match.url}/reports`}>
                            Report
                        </Link>
                    </Box>
                    <Box sx={{ mb: [3] }}>
                        <Link
                            sx={{
                                variant: 'links.nav'
                            }} onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                this.onButtonClicked(true)
                            }}>
                            Delete
                        </Link>
                        {this.state.openDelete && (
                            <>
                                <div style={{ zIndex: "10", position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "black", opacity: "50%" }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.onButtonClicked(false)
                                    }}></div>
                                <div style={{ zIndex: "10", position: "fixed", top: "0", left: "0", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center" }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.onButtonClicked(false)
                                    }}>
                                    <div style={{display: "flex", flexDirection: "column", margin: "auto", width: "90%", maxWidth: "28em", backgroundColor: "#ffffff", borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.06)"}}>
                                        <Text sx={{ mb: "8px" }}>Are you sure you want to delete <b>{this.props.match.params.topic}</b>?</Text>
                                        <div style={{ display: "flex", marginTop: "auto", alignContent: "end", justifyContent: "end", gap: "8px" }}>
                                            <Button variant="secondary" onClick={(e) => {
                                                e.stopPropagation()
                                                this.onButtonClicked(false)
                                            }}>
                                                Back
                                            </Button>
                                            <Button variant="danger" onClick={(e) => {
                                                e.stopPropagation()
                                                this.deleteConversation()
                                            }}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Box>
                </Flex>
                <Box sx={{ p: [3, 4], flex: '1 1 auto', width: '100%', minWidth: 0, maxWidth: ['100%', '48em'], mx: [0, 4] }}>
                    <Switch>
                        <Route
                            exact
                            path={`${match.path}/`}
                            component={ConversationConfig}
                        />
                        <Route
                            exact
                            path={`${match.path}/share`}
                            component={ShareAndEmbed}
                        />
                        <Route exact path={`${match.path}/reports`} component={Reports} />
                        <Route
                            path={`${match.path}/comments`}
                            component={ModerateComments}
                        />
                        <Route
                            exact
                            path={`${match.path}/stats`}
                            component={ConversationStats}
                        />
                        {/* <Route exact path={`${match.path}/export`} component={DataExport} /> */}
                    </Switch>
                </Box>
            </Flex>
        )
    }
}

export default ConversationAdminContainer
