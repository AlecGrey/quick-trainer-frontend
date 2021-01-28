import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
// REDUX
import { connect } from 'react-redux';

const ChatFeedMessages = ({ userId, agreementId, agreements, showFeed }) => {
    // SAVE MESSAGES IN STATE
    const [messages, setMessages] = useState([])

    // USEREF FOR SCROLLING CHAT
    const messagesEndRef = useRef(null)

    // CONVERT PROP AGREEMENTS TO STATE MESSAGES
    useEffect(() => {
        const agreement = agreements.find(agreement => agreement.id === agreementId)
        setMessages(agreement.chat_messages)
    },[agreements, agreementId])

    const renderChatMessages = () => {
        return messages.map( message => {
            return <ChatMessage
                key={ message.id }
                isUser={ message.user_id === userId }
                content={ message.content }
                createdAt={ message.created_at }
            />
        })
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // WHEN A NEW MESSAGE IS RECEIVED, SCROLL PAGE TO BOTTOM
    useEffect(() => {
        scrollToBottom()
    }, [agreements])

    return (
        <Container 
            id='chat-feed' 
            className='d-flex align-items-center justify-content-start flex-column flex-grow-1 flex-nowrap'>
            { renderChatMessages() }
            <div ref={ messagesEndRef } />
        </Container>
    )
}

const ChatMessage = ({ isUser, content, createdAt }) => {

    const formattedTime = () => {
        const dateTimeArray = createdAt.split('T')
        const date = dateTimeArray[0]
        const time = dateTimeArray[1].split('.')[0]
        return `${date}, at ${time.slice(0,5)}`
    }

    const formattedClassName = () => {
        return isUser ? 
            'user-message d-flex flex-column align-items-end' :
            'received-message d-flex flex-column align-items-start'
    }

    return (
        <Container className='message d-flex flex-column'>
            <div className={ formattedClassName() }>
                <p className='time'>{ formattedTime() }</p>
                <p className='content shadow-sm'>{ content }</p>
            </div>
        </Container>
    )
}

const mapStateToProps = state => {
    return {
        agreements: state.agreements
    }
}

export default connect(mapStateToProps)(ChatFeedMessages);
