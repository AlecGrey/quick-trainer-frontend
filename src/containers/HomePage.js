import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image'
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import PlaceholderImage from '../components/PlaceholderImage';

const HomePage = ({ user, agreements }) => {

    // const [ notifications, setNotifications ] = useState([])

    // useEffect(() => {
    //     // CONVERT AGREEMENTS INTO ARRAY OF NOTIFICATION OBJECTS, ADD TO NOTIFICATION STATE OBJECT
    // })

    // const reduceAgreementToNotification = agreement => {
    //     case () {

    //     }
    // }

    return (
        <Container id='home-page' className='d-flex align-items-center flex-column'>
            {   !!user.imageUrl ? 
                <Image className='shadow homepage-image' src={ user.imageUrl } /> : 
                <PlaceholderImage size='8rem' /> 
            }
            <h1 className='.welcome-message'>{ `Welcome, ${ user.name }!` }</h1>
            {/* <Container className='d-flex justify-content-center'>
                <div className='nav-link-container d-flex justify-content-end'>
                    <Link to='/manage-account'>User Settings</Link>
                </div>
                <div className='v-divider' />
                <div className='nav-link-container d-flex justify-content-start'>
                    <Link to='/training-agreements'>
                        { user.isTrainer ? 'View Roster' : 'View Coaches' }
                    </Link>
                </div>
            </Container> */}
        </Container>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        agreements: state.agreements
    }
}

export default connect(mapStateToProps)(HomePage);
