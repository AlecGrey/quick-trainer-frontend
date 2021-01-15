import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image'
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

const HomePage = ({ user, agreements }) => {
    return (
        <Container className='d-flex align-items-center flex-column'>
            <Image src="" roundedCircle />
        </Container>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        agreements: state.agreements
    }
}

export default connect()(HomePage);
