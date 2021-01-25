import React, { useState, useEffect, useContext } from 'react';
// ACTION CABLE
import { ActionCableContext } from './ChatFeedNav';
// BOOTSTRAP
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// REDUX
import { connect } from 'react-redux';
// COMPONENT DEPENDENCIES
import ChatFeedMessages from './ChatFeedMessages';

const ChatFeed = ({ userId, feed, showFeed }) => {

    const cable = useContext(ActionCableContext)
    const [channel, setChannel] = useState(null)
    const [content, setContent] = useState('')

    // SETS UP THE CHANNEL WITH UNMOUNTING CALLBACK AS RETURN VALUE
    useEffect(() => {
        const channel = cable.subscriptions.create({
            channel: 'MessagesChannel',
            id: feed.id
        })

        setChannel(channel)

        return () => {
            channel.unsubscribe()
        }
    }, [feed])

    // THIS CONNECTION WILL ONLY BE USED FOR SENDING MESSAGES TO DB
    const sendMessage = content => {
        console.log('SENDING MESSAGE TO DB')
        const data = {
            coach_client_id: feed.id,
            user_id: userId,
            content
        }
        channel.send(data)
    }

    const handleSubmit = e => {
        e.preventDefault()
        sendMessage(content)
        setContent('')
    }

    return (
        <Container id='chat-feed-container' className='d-flex flex-column align-items-stretch shadow-sm'>
            <ChatFeedHeader recipient={ feed.chatUser }/>
            <div className='h-divider' />
            <ChatFeedMessages
                userId={ userId }
                agreementId={ feed.id }
                showFeed={ showFeed }
            />
            <div className='h-divider' />
            <ChatFeedInput 
                content={ content }
                setContent={ setContent }
                handleSubmit={ handleSubmit } 
            />
        </Container>
    );
}

const ChatFeedHeader = ({ recipient }) => {
    return (
        <Container className='header d-flex'>
            <h5>{ recipient }</h5>
            {/* Anything else? */}
        </Container>
    )
}

const ChatFeedInput = ({ content, setContent, handleSubmit }) => {

    const handleContentChange = e => setContent(e.target.value)

    return (
        <Form onSubmit={ handleSubmit }>
            <Form.Group as={Row} noGutters={true}>
                <Col>
                    <Form.Control 
                        onChange={ handleContentChange } 
                        type='text' 
                        value={ content }/>
                </Col>
                <Col sm={ 2 }>
                    <Button 
                        id='message-submit'
                        onClick={ handleSubmit } 
                        variant='success'
                        disabled={ content === '' }
                    >enter</Button>
                </Col>
            </Form.Group>
        </Form>
    )
}

const mapStateToProps = state => {
    return {
        agreements: state.agreements
    }
}

export default connect(mapStateToProps)(ChatFeed);
