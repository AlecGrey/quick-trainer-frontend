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

    const handleFetchData = json => {
        setTrainingSession(json)
    }

    const handleOnHide = event => {
        setShow(false)
        setId(null)
    }

    return (
        <Modal
        size="lg"
        show={show}
        onHide={handleOnHide}
        aria-labelledby="training-session-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="training-session-title">{ trainingSession ? trainingSession.name : 'Loading...' }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                
            </div>
        </Modal.Body>
      </Modal>
    );
}

export default TrainingSessionModal;
