import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const TrainingSessionModal = ({ show, setShow, id, setId, userIsTrainer }) => {

    // STATE HOOKS
    const [ trainingSession, setTrainingSession ] = useState(null)
    const [ showCompleteWorkoutForm, setShowCompleteWorkoutForm ] = useState(false)
    const [ completeWorkoutParams, setCompleteWorkoutParams ] = useState({})
    // FETCH SESSION DATA ON RECEIVING ID
    useEffect(() => {
        if (id === null) return
        setTrainingSession(null)
        fetchTrainingSessionData()
    },[id])

    // EVENT HANDLERS
    const handleRatingChange = e => {
        // FINISH
    }

    const handleFeedbackChange = e => {
        // FINISH
    }

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

    const launchCompleteWorkoutForm = e => {
        setShowCompleteWorkoutForm(true)
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
                <div className='status-container d-flex'>
                    <h3 className='status'>Status:</h3>
                    <p className='complete-status'>{ trainingSession.is_complete ? 'Complete' : 'Not Complete' }</p>
                    <h3 className='rating'>Rating:</h3>
                    <p className='rating-value'>{ !!trainingSession.is_complete ? trainingSession.rating : 'n/a' }</p>
                </div>
                <div className='description-container d-flex'>
                    <h3 className='description'>Description: </h3>
                    <p className='description-value'>{ trainingSession.description }</p>
                </div>
                <div className='h-divider' />
                <h1 className='workout-header' >Workout</h1>
                <div className='workout-table'>
                    <div className='workout-row'>
                        <p className='exercise heading'>Exercise</p>
                        <p className='schema heading'>Schema</p>
                        <p className='recovery heading'>Recovery</p>
                        <p className='description heading'>Description</p>
                    </div>
                    { renderAllWorkoutItems() }
                </div>
                { userIsTrainer || trainingSession.is_complete ? null: <Button onClick={ launchCompleteWorkoutForm }>Complete Workout</Button> }
            </>
        )
    }

    const renderAllWorkoutItems= () => {
        return trainingSession.workout_items.map( workoutItem => {
            return <div key={ workoutItem.id } className='workout-row'>
                <p className='exercise'>{ workoutItem.exercise }</p>
                <p className='schema'>{ formatSchema(workoutItem) }</p>
                <p className='recovery'>{ workoutItem.rest_interval } seconds</p>
                <p className='description'>{ workoutItem.description }</p>
            </div>
        })
    }
    // HELPER METHOD FOR METHOD: renderAllWorkoutItems()
    const formatSchema = workoutItem => {
        return !!workoutItem.repetitions ? 
            `${ workoutItem.sets } x ${ workoutItem.repetitions } repetitions` :
            `${ workoutItem.sets } x ${ workoutItem.duration } seconds`
    }

    const renderCompleteWorkoutForm = () => {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Rate the workout: </Form.Label>
                    <Form.Control as='select' onChange={ handleRatingChange }>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Leave Feedback</Form.Label>
                    <Form.Control as='textarea' onChange={ handleFeedbackChange }></Form.Control>
                </Form.Group>
            </Form>
        )
    }

    return (
        <Modal size="lg" show={show} onHide={handleOnHide} aria-labelledby="training-session-title">
            <Modal.Header className='training-session-header' closeButton>
                { trainingSession ? renderTrainingSessionHeader() : null }
            </Modal.Header>
            <Modal.Body className='training-session-body'>
                { trainingSession ? renderTrainingSessionBody() : null }
                { showCompleteWorkoutForm ? renderCompleteWorkoutForm() : null }
            </Modal.Body>
      </Modal>
    );
}

export default TrainingSessionModal;
