import React, { useState, useEffect, useContext, useRef } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { ActionCableContext } from './ChatFeedNav';
import { connect } from 'react-redux';
import { addChatMessageToAgreement } from '../actions/agreements';

const ChatUser = ({ event, active, showFeed, agreement, addChatMessageToAgreement, addNewMessageToast }) => {

    const cable = useContext(ActionCableContext)
    const activeRef = useRef(active)
    const showFeedRef = useRef(showFeed)

    // SET UP CHANNEL THAT CAN RECEIVE MESSAGES
    useEffect(() => {
        const channel = cable.subscriptions.create({
            channel: 'MessagesChannel',
            id: agreement.id
        }, {
            received: (json) => {
                // reformat json to payload...
                const data = JSON.parse(json).data
                if ( validNewToast() ) addNewMessageToast(data.attributes, agreement)
                const payload = {
                    agreementId: parseInt(data.relationships.coach_client.data.id),
                    chatMessage: data.attributes
                }
                addChatMessageToAgreement(payload)
            }
        })

        return () => {
            channel.unsubscribe()
            console.log('channel unsubscribed')
        }
    }, [])

    useEffect(()=> {
        activeRef.current = active
        showFeedRef.current = showFeed
    }, [showFeed, active])

    const validNewToast = () => {
        return !( activeRef.current && showFeedRef.current )
    }

    return (
        <NavDropdown.Item 
            onClick={ event }
            active={ active }
        >
            { agreement.chatUser }
        </NavDropdown.Item>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        addChatMessageToAgreement: (params) => dispatch(addChatMessageToAgreement(params))
    }
}

export default connect(null, mapDispatchToProps)(ChatUser);
