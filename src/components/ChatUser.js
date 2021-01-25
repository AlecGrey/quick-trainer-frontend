import React, { useState, useEffect, useContext } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { ActionCableContext } from './ChatFeedNav';
import { connect } from 'react-redux';
import { addChatMessageToAgreement } from '../actions/agreements';

const ChatUser = ({ event, active, agreement, addChatMessageToAgreement }) => {

    const cable = useContext(ActionCableContext)

    // SET UP CHANNEL THAT CAN RECEIVE MESSAGES
    useEffect(() => {
        cable.subscriptions.create({
            channel: 'MessagesChannel',
            id: agreement.id
        }, {
            received: (data) => {
                // reformat data to payload...
                debugger
                // addChatMessageToAgreement({ 
                //     agreementId: ,
                //     chatMessage: 
                // })
            }
        })
    }, [agreement])

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
