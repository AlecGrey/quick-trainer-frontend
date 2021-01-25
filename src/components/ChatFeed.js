import React, { useState, useEffect, useContext } from 'react';
// ACTION CABLE
import { ActionCableContext } from './ChatFeedNav';
// BOOTSTRAP
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ChatFeed = ({ userId, feed }) => {

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
        const data = {
            coach_client_id: feed.id,
            user_id: userId,
            content
        }
        channel.send(data)
    }

    const handleSubmitClick = e => {
        sendMessage(content)
        console.log('MESSAGE SENT:', content)
        setContent('')
    }

    return (
        <Container id='chat-feed-container' className='d-flex flex-column align-items-stretch shadow-sm'>
            <ChatFeedHeader recipient={ feed.chatUser }/>
            <ChatFeedMessageBox />
            <ChatFeedInput 
                content={ content }
                setContent={ setContent }
                handleSubmitClick={ handleSubmitClick } 
            />
        </Container>
    );
}

const ChatFeedHeader = ({ recipient }) => {
    return (
        <Container className='d-flex' fluid>
            <h5>{ recipient }</h5>
            {/* Anything else? */}
        </Container>
    )
}

const ChatFeedMessageBox = () => {
    return (
        <Container className='d-flex flex-grow-1'>
            MESSAGES
        </Container>
    )
}

const ChatFeedInput = ({ content, setContent, handleSubmitClick }) => {

    const handleContentChange = e => setContent(e.target.value)

    return (
        <Form>
            <Form.Group as={Row} noGutters={true}>
                <Col>
                    <Form.Control 
                        onChange={ handleContentChange } 
                        type='text' 
                        value={ content }/>
                </Col>
                <Col sm={ 2 }>
                    <Button onClick={ handleSubmitClick } variant='success'>enter</Button>
                </Col>
            </Form.Group>
        </Form>
    )
}

export default ChatFeed;
