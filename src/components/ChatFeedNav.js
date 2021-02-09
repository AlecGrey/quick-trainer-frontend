import React, { useState, useEffect, createContext, useRef } from 'react';
// REACT BOOTSTRAP
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Toast from 'react-bootstrap/Toast';
// COMPONENT DEPENDENCIES
import ChatFeed from './ChatFeed';
import ChatUser from './ChatUser';
import PlaceholderImage from './PlaceholderImage';
// ACTION CABLE!
import actionCable from 'actioncable';

const CableApp = {}
CableApp.cable = actionCable.createConsumer('wss://quick-trainer-backend.herokuapp.com/cable')
export const ActionCableContext = createContext()

const ChatFeedNav = ({ user, agreements }) => {

    const [ activeFeed, setActiveFeed ] = useState({})
    const [ chatrooms, setChatrooms ] = useState([])
    const [ showFeed, setShowFeed ] = useState(false)
    const [ notifications, setNotifications ] = useState([])
    const notificationsRef = useRef([])

    useEffect(() => {
        const formattedAgreements = mapAgreementsToChatrooms()
        setChatrooms([...formattedAgreements])
    },[ agreements ])

    const userIsTrainer = () => {
        return user.isTrainer
    }

    const mapAgreementsToChatrooms = () => {
        return agreements.map( agreement => {
            return {
                id: agreement.id,
                chatUser: userIsTrainer() ? agreement.client.name : agreement.trainer.name,
                chatUserImg: userIsTrainer() ? agreement.client.image_url : agreement.trainer.image_url
            }
        })
    }

    const renderDropdownItemsFromState = () => {
        return chatrooms.map( (room, i) => { 
            return <ChatUser
                key={ i }
                event={ () => setAsCurrentFeed(room) }
                active={ room.id === activeFeed.id }
                showFeed={ showFeed }
                agreement={ room }
                addNewMessageToast={ addNewMessageToast }
            />
        })
    }

    const renderChatfeedFromState = () => {
        if (!activeFeed.id) return
        else return (
            <Nav.Link active={ showFeed } onClick={ toggleChatView }>{ activeFeed.chatUser }</Nav.Link>
        )
    }

    const setAsCurrentFeed = room => {
        if (activeFeed.id === room.id) setActiveFeed({})
        else setActiveFeed(room)
        setShowFeed(false)
    }

    const toggleChatView = e => {
        setShowFeed(!showFeed)
    }

    const addNewMessageToast = (chatMessage, agreement) => {
        const newNotification = {
            ...chatMessage,
            chatUser: agreement.chatUser,
            chatUserImg: agreement.chatUserImg
        }
        setNotifications([...notificationsRef.current, newNotification])
        notificationsRef.current.push(newNotification)
    }

    const renderToastNotifications = () => {
        return notifications.map( notification => {
            return <ToastNotification 
                key={ notification.id }
                notification={ notification } 
                removeToast={ removeToast }
            />
        })
    }

    const removeToast = id => {
        const newNotifications = notificationsRef.current.filter(ref => ref.id !== id)
        notificationsRef.current = newNotifications
        setNotifications([...newNotifications])
    }

    return (
        <ActionCableContext.Provider value={ CableApp.cable }>
           <Navbar id='chatfeed-nav'fixed='bottom' variant='dark'>
                <Navbar.Collapse id='chatfeed-nav-items'className="justify-content-end">
                    <Nav>
                        { renderChatfeedFromState() }
                        <NavDropdown title={ user.isTrainer ? 'Clients' : 'Coaches' } id="nav-dropdown" drop='up' alignRight>
                            { renderDropdownItemsFromState() }
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                { showFeed ? <ChatFeed 
                    userId={ user.id } 
                    feed={ activeFeed } 
                    showFeed={ showFeed }
            /> : null }
            </Navbar>
            <div 
                id='toast-notification-container' 
                className='d-flex flex-column-reverse align-items-end justify-content-end'
            >
                { renderToastNotifications() }
            </div>
        </ActionCableContext.Provider>
        
    );
}

const ToastNotification = ({ notification, removeToast }) => {

    const [ show, setShow ] = useState(true)
    const { content, id, chatUser, chatUserImg } = notification

    const closeToastNotification = () => {
        setShow(false)
        removeToast(id)
    }

    return (
        <Toast 
            onClose={ closeToastNotification }
            show={ show }
            delay={ 5000 }
            autohide
            style={{ minWidth: '220px', flexBasis: 'auto' }}
        >
            <Toast.Header>
                <img src={ chatUserImg } className="rounded mr-2" alt="" />
                <strong className="mr-auto">{ chatUser }</strong>
                <small>New Message</small>
            </Toast.Header>
            <Toast.Body>{ content }</Toast.Body>
        </Toast>
    )
}

export default ChatFeedNav;
