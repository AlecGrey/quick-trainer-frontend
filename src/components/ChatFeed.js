import React, { useState, useEffect, useContext } from 'react';
// ACTION CABLE
import { ActionCableContext } from './ChatFeedNav';
// BOOTSTRAP
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
// REDUX
import { connect } from 'react-redux';
// COMPONENT DEPENDENCIES
import ChatFeedMessages from './ChatFeedMessages';
import PlaceholderImage from './PlaceholderImage';
// REACT ICONS
import { FaDumbbell } from "react-icons/fa";

const ChatFeed = ({ userId, feed, showFeed }) => {

    const cable = useContext(ActionCableContext)
    const [channel, setChannel] = useState(null)
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)

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
        const newError = checkContentForErrors()
        if (newError) setError(newError)
        else {
            sendMessage(content)
            setContent('')
        }
    }

    const checkContentForErrors = () => {
        if (content === '') return 'message cannot be blank!'
        else if (content.length > 250) return 'cannot exceed 250 characters'
        else return null
    }

    return (
        <Container id='chat-feed-container' className='d-flex flex-column align-items-stretch shadow-sm'>
            <ChatFeedHeader 
                error={ error } 
                recipient={ feed.chatUser }
                recipientImg={ feed.chatUserImg }
                content={ content }
            />
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
                error={ error }
                setError={ setError }
                handleSubmit={ handleSubmit } 
            />
        </Container>
    );
}

const ChatFeedHeader = ({ recipient, recipientImg, error, content }) => {

    const remainingCharacters = () => {
        return 250 - content.length
    }

    return (
        <Container className='header d-flex'>
            {   !!recipientImg ?
                    <Image 
                        style={{height: '25px', width: '25px', objectFit: 'cover'}} 
                        src={ recipientImg } 
                        rounded
                    /> :
                    <PlaceholderImage
                        size='19px'
                        padding='2px'
                        noShadow={true}
                        borderRadius='5px'
                    />
            }
            <h5>{ recipient }</h5>
            {/* Anything else? */}
            { error ? 
                <p className='error'>{ error }</p> : 
                <p className='character-count'>{ `${remainingCharacters()}/250` }</p>
            }
        </Container>
    )
}

const ChatFeedInput = ({ content, setContent, handleSubmit, error, setError }) => {

    const handleContentChange = e => {
        if (content.length < 250) setContent(e.target.value)
        if (error !== null) setError(null)
    }

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
                        style={{ width:'100%' }} 
                        id='message-submit'
                        onClick={ handleSubmit } 
                        variant='success'
                        disabled={ content === '' }
                    >
                        <FaDumbbell size='1.2rem'/>
                    </Button>
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
