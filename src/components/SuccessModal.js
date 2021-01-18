import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

const SuccessMessage = ({ successMessage, resetSuccessMessage }) => {

    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!!successMessage) setShow(true)
    }, [ successMessage ])

    const handleOnHide = () => {
        setShow(false)
        resetSuccessMessage()
    }

    return (
        <Modal show={ show } onHide={ handleOnHide } backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Success!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { successMessage }
            </Modal.Body>
        </Modal>
    );
}

export default SuccessMessage;