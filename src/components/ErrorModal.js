import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

const ErrorMessage = ({ errorMessage, resetErrorMessage }) => {

    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!!errorMessage) setShow(true)
    }, [ errorMessage ])

    const handleOnHide = () => {
        setShow(false)
        resetErrorMessage()
    }

    return (
        <Modal show={ show } onHide={ handleOnHide } backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Error!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { errorMessage }
            </Modal.Body>
        </Modal>
    );
}

export default ErrorMessage;
