import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import ChatFeed from './ChatFeed';

const ChatFeedNav = ({ user, agreements }) => {

    const [ activeFeed, setActiveFeed ] = useState({})
    const [ chatrooms, setChatrooms ] = useState([])
    const [ showFeed, setShowFeed ] = useState(false)

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
                chatUser: userIsTrainer() ? agreement.client.name : agreement.trainer.name
            }
        })
    }

    const renderDropdownItemsFromState = () => {
        return chatrooms.map( (room, i) => { 
            return <NavDropdown.Item 
                onClick={ () => setAsCurrentFeed(room) }
                active={ room.id === activeFeed.id }
                key={ i }>{ room.chatUser }</NavDropdown.Item>
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

    return (
        <Navbar id='chatfeed-nav'fixed='bottom'>
            <Navbar.Collapse id='chatfeed-nav-items'className="justify-content-end">
                <Nav>
                    { renderChatfeedFromState() }
                    <NavDropdown title="Feeds" id="nav-dropdown" drop='up' alignRight>
                        { renderDropdownItemsFromState() }
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
            { showFeed ? <ChatFeed feed={ activeFeed } /> : null }
        </Navbar>
    );
}

export default ChatFeedNav;
