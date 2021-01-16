import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image'
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";

const ManageAccountPage = ({ user }) => {

    const { name, imageUrl } = user

    return (
        <Container id='account-settings-page' className='no-gutters d-flex justify-content-stretch'>
            <Container className='d-flex flex-column align-items-center'>
                <Image className='shadow homepage-image' src={ imageUrl } />
                <h1 className='.welcome-message'>{ name }</h1>
            </Container>
            <Container className='flex-grow d-flex flex-column'>
                <p>ITEM</p>
                <p>ITEM</p>
                <p>ITEM</p>
                <p>ITEM</p>
                <p>ITEM</p>
                <p>ITEM</p>
            </Container>
        </Container>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//         // update user!
//     }
// }

export default connect(mapStateToProps/*, mapDispatchToProps*/)(ManageAccountPage);
