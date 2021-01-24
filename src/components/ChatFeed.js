import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

const ChatFeed = ({ feed }) => {



    return (
        <Container id='chat-feed-container' className='d-flex flex-column align-items-stretch shadow-sm'>
            <ChatFeedHeader />
            <ChatFeedMessageBox />
            <ChatFeedInput />
        </Container>
    );
}

const ChatFeedHeader = () => {
    return (
        <div className='d-flex'>
            HEADER
        </div>
    )
}

const ChatFeedMessageBox = () => {
    return (
        <div className='d-flex flex-grow-1'>
            MESSAGES
        </div>
    )
}

const ChatFeedInput = () => {
    return (
        <div className='d-flex'>
            INPUT FIELDS
        </div>
    )
}

export default ChatFeed;
