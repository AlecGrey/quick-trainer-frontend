import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const NavBar = ({ logoutUser }) => {

    const history = useHistory()
    const location = useLocation()

    const navigateToAgreements = e => {
        if ( location.pathname !== "/training-agreements" ) {
            history.push('/training-agreements')
        }
    }

    const navigateToAccountManagement = e => {
        if ( location.pathname !== "/manage-account" ) {
            history.push('/manage-account')
        }
    }

    const navigateToHome = e => {
        if ( location.pathname !== "/home" ) {
            history.push("/home")
        }
    }

    const handleLogoutUser = e => {
        logoutUser()
        localStorage.clear()
    }

    return (
        <Navbar id='site-header' fixed='top' bg='dark' variant='dark'>
            <Navbar.Brand onClick={ navigateToHome }>Quick Trainer</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-items" />
            <Navbar.Collapse id='navbar-items'>
                <Nav>
                    <Nav.Link 
                        onClick={ navigateToAgreements }
                        active={ location.pathname === "/training-agreements" }>
                            Training Agreements
                    </Nav.Link>
                    <Nav.Link 
                        onClick={ navigateToAccountManagement }
                        active={ location.pathname === "/manage-account" }>
                            Account Management
                    </Nav.Link>
                </Nav>
                <Nav className='logout-nav'>
                    <Nav.Link onClick={ handleLogoutUser }>Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;
