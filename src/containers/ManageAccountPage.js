import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image'
import { connect } from 'react-redux';
import AccountSettings from '../components/AccountSettings';
import PlaceholderImage from '../components/PlaceholderImage';

const ManageAccountPage = ({ user }) => {

    const { name, imageUrl } = user

    return (
        <div id='account-settings-page' className='no-gutters d-flex justify-content-stretch'>
            <Container className='user-preview d-flex flex-column align-items-center'>
                { !!imageUrl ?
                    <Image className='shadow homepage-image' src={ imageUrl } /> : 
                    <PlaceholderImage size='8rem' />
                }
                <h1 className='.welcome-message'>{ name }</h1>
            </Container>
            <AccountSettings user={ user }/>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ManageAccountPage);
