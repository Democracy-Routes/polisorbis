/** @jsx jsx */
import { jsx, Button, Text, Card } from 'theme-ui'
import PropTypes from 'prop-types'
import React from 'react'

class Conversation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openDelete: false
        }
    }

    onButtonClicked(state) {
        this.setState({openDelete: state})
    }

    render() {
        return (
            <Card
                onClick={this.props.goToConversation}
                sx={{ cursor: 'pointer', 'overflow-wrap': 'break-word', mb: [3] }}
                key={this.props.i}>
                <Text sx={{ fontWeight: 'bold', fontSize: [3], mb: [2] }}>{this.props.c.topic}</Text>
                <Text>{this.props.c.description}</Text>
                <Text data-test-id="embed-page">
                    {this.props.c.parent_url ? `Embedded on ${this.props.c.parent_url}` : null}
                </Text>
                <Text sx={{ mt: [2] }}>{this.props.c.participant_count} participants</Text>
                <div style={{display: "flex", justifyContent: "end"}}>
                    <Button variant="secondary" sx={{ mt: "8px" }} onClick={(e) => {
                            e.stopPropagation()
                            this.onButtonClicked(true)
                        }}>
                        Delete
                    </Button>
                </div>
                {this.state.openDelete && (
                    <>
                        <div style={{zIndex: 10, position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15,23,42,0.5)"}}
                        onClick={(e) => {
                                e.stopPropagation()
                                this.onButtonClicked(false)
                            }}></div>
                        <div style={{zIndex: "10", position: "fixed", top: "0", left: "0", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center"}}
                            onClick={(e) => {
                                    e.stopPropagation()
                                    this.onButtonClicked(false)
                                }}>
                            <div style={{display: "flex", flexDirection: "column", margin: "auto", width: "90%", maxWidth: "28em", backgroundColor: "#ffffff", borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.06)"}}>
                                <Text sx={{ mb: "8px" }}>Are you sure you want to delete <b>{this.props.c.topic}</b>?</Text>
                                <div style={{display: "flex", marginTop: "auto", alignContent: "end", justifyContent: "end", gap: "8px"}}>
                                    <Button variant="secondary" onClick={(e) => {
                                            e.stopPropagation()
                                            this.onButtonClicked(false)
                                        }}>
                                        Back
                                    </Button>
                                    <Button variant="danger" onClick={(e) => {
                                            e.stopPropagation()
                                            this.props.deleteConversation(this.props.c.conversation_id)
                                        }}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        )
    }
}

Conversation.propTypes = {
    c: PropTypes.shape({
        conversation_id: PropTypes.string,
        topic: PropTypes.string,
        description: PropTypes.string,
        parent_url: PropTypes.string,
        participant_count: PropTypes.number
    }),
    i: PropTypes.number.isRequired,
    goToConversation: PropTypes.func.isRequired,
    deleteConversation: PropTypes.func.isRequired
}

export default Conversation
