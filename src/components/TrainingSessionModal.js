import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'

const TrainingSessionModal = ({ show, id, setShow, setId }) => {

    const [ trainingSession, setTrainingSession ] = useState(null)

    useEffect(() => {
        if (id === null) return
        setTrainingSession(null)
        fetchTrainingSessionData()
    },[id])

    const fetchTrainingSessionData = () => {
        const url = `http://localhost:5000/training-sessions/${id}`
        const params = fetchTrainingSessionParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleFetchData)
    }

    const fetchTrainingSessionParams = () => {
        return {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${ localStorage.getItem('token') }`
              }
        }
    }

    // EVENT HANDLERS
    const handleFetchData = json => {
        setTrainingSession(json)
    }

    const handleOnHide = event => {
        setShow(false)
        setId(null)
    }

    const formattedDate = () => {
        const sessionDate = trainingSession.created_at.slice(0,10).split('-')
        return `${ sessionDate[1] } / ${ sessionDate[2] } / ${ sessionDate[0] }`
    }

    // SUB-COMPONENTS TO RENDER WITHIN JSX RETURN
    const renderTrainingSessionHeader = () => {
        return (
            <>
                <Modal.Title id="training-session-title">{ trainingSession ? trainingSession.name : 'Loading...' }</Modal.Title>
                <p>date:</p>
                <h3>{ formattedDate() }</h3>
            </>
        )
    }

    const renderTrainingSessionBody = () => {
        return (
            <>
                YEET
            </>
        )
    }

    return (
        <Modal size="lg" show={show} onHide={handleOnHide} aria-labelledby="training-session-title">
            <Modal.Header className='training-session-header' closeButton>
                { trainingSession ? renderTrainingSessionHeader() : null }
                
            </Modal.Header>
            <Modal.Body>
                { trainingSession ? renderTrainingSessionBody() : null }
            </Modal.Body>
      </Modal>
    );
}

export default TrainingSessionModal;
