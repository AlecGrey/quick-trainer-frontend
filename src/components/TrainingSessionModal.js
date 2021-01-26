import React, { useState, useEffect } from 'react';
// BOOTSTRAP COMPONENTS
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// REDUX AND ACTION
import { updateTrainingSessionInAgreement } from '../actions/agreements';
import { connect } from 'react-redux';
// REACT-TO-PDF
import ReactToPdf from 'react-to-pdf';
// REACT ICONS
import { IoMdDownload } from "react-icons/io";
import { GiBiceps } from "react-icons/gi";

const ref = React.createRef()

const TrainingSessionModal = ({ show, setShow, id, setId, userIsTrainer, updateTrainingSession, setSuccessMessage, setErrorMessage }) => {

    // STATE HOOKS
    const [ trainingSession, setTrainingSession ] = useState(null)
    const [ showCompleteWorkoutForm, setShowCompleteWorkoutForm ] = useState(false)
    const [ feedback, setFeedback ] = useState({})
    const [ feedbackErrors, setFeedbackErrors ] = useState({})
    // FETCH SESSION DATA ON RECEIVING ID
    useEffect(() => {
        if (id === null) return
        setTrainingSession(null)
        fetchTrainingSessionData()
    },[id])

// ================================
//        EVENT HANDLERS
// ================================

    const handleOnHide = event => {
        setShow(false)
        setId(null)
    }

    const handleRatingChange = e => {
        resetError('rating')
        setFeedback({
            ...feedback,
            rating: e.target.value
        })
    }

    const handleFeedbackChange = e => {
        resetError('feedback')
        setFeedback({
            ...feedback,
            feedback: e.target.value
        })
    }

    const handleSubmitFeedback = e => {
        // FINISH
        checkForErrors()
        if ( feedbackErrorsPresent() ) return
        else ( fetchFeedbackToTrainingSession() )
    }

    const toggleCompleteWorkoutForm = e => {
        setShowCompleteWorkoutForm(!showCompleteWorkoutForm)
        setFeedback({})
        setFeedbackErrors({})
    }

// ===================================
//       ERROR HANDLING METHODS
// ===================================

    const checkForErrors = () => {
        if (isEmptyOrSpaces( feedback.feedback )) {
            setFeedbackErrors({
                ...feedbackErrors,
                feedback: 'must provide feedback of some kind'
            })
        }
        if ( !feedback.rating ) {
            setFeedbackErrors({
                ...feedbackErrors,
                rating: 'Select a value from 1-5'
            })
        }
    }

    const isEmptyOrSpaces = str => {
        return !str || str.match(/^ *$/) !== null;
    }

    const resetError = field => {
        setFeedbackErrors({
            ...feedbackErrors,
            [field]: null
        })
    }

    const feedbackErrorsPresent = () => {
        return feedbackErrors.rating || feedbackErrors.feedback
    }

// =================================
//        FETCH REQUESTS
// =================================

    const fetchTrainingSessionData = () => {
        const url = `http://localhost:5000/training-sessions/${id}`
        const params = fetchTrainingSessionParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleGetTrainingSessionFetch)
    }

    const handleGetTrainingSessionFetch = json => {
        if (!!json.errors) {
            setShow(false)
            setErrorMessage('Unable to fetch training session data!')
        } else {
            setTrainingSession(json)
        }
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

    const fetchFeedbackToTrainingSession = () => {
        const url = `http://localhost:5000/training-sessions/${id}`
        const params = fetchFeedbackParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(handlePatchTrainingSessionFetch)
    }

    const handlePatchTrainingSessionFetch = json => {
        if (!!json.errors) {
            setShow(false)
            setShowCompleteWorkoutForm(false)
            setErrorMessage('Unable to update training session!')
        } else {
            updateTrainingSession(json)
            setTrainingSession(json)
            setShow(false)
            setShowCompleteWorkoutForm(false)
            setSuccessMessage('Your feedback has been submitted!')
        }
    }

    const fetchFeedbackParams = () => {
        return {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(feedback)
        }
    }

// =======================================
//          MISC HELPER METHODS
// =======================================

    const formattedDate = () => {
        const sessionDate = trainingSession.created_at.slice(0,10).split('-')
        return `${ sessionDate[1] } / ${ sessionDate[2] } / ${ sessionDate[0] }`
    }

// ============================================
//           INTERNAL SUBCOMPONENTS
// ============================================

    const renderTrainingSessionHeader = () => {
        return (
            <>
                <Modal.Title id="training-session-title">{ trainingSession ? trainingSession.name : 'Loading...' }</Modal.Title>
                <p>date:</p>
                <h3>{ trainingSession ? formattedDate() : 'Loading...' }</h3>
            </>
        )
    }

    const renderTrainingSessionBody = () => {

        const pdfFilename = () => {
            if (!!trainingSession && !!trainingSession.name) {
                const date = trainingSession.created_at.split('T')[0].split('-').join('')
                return `${date} ${trainingSession.name}.pdf`
            } else return 'workout.pdf'
        }

        const renderGymRating = () => {
            const starCount = trainingSession.rating
            const stars = []
            for (let i = 5; i > 0; i--) {
                stars.push(
                    <BicepStar size='1.5rem' checked={ i+1 >= starCount }/>
                )
            }
            return stars
        }

        return (
            <>
                <div className='status-container d-flex'>
                    <h3 className='status'>Status:</h3>
                    <p className='complete-status'>{ trainingSession.is_complete ? 'Complete' : 'Not Complete' }</p>
                    <h3 className='rating'>Rating:</h3>
                    <p className='rating-value'>{ !!trainingSession.is_complete ? renderGymRating() : 'n/a' }</p>
                </div>
                <div className='description-container d-flex'>
                    <h3 className='description'>Description: </h3>
                    <p className='description-value'>{ trainingSession.description }</p>
                </div>
                {/* <div className='h-divider' /> */}
                <div className='d-flex justify-content-center'>
                    <h1 className='workout-header' >Workout</h1>
                    <ReactToPdf targetRef={ ref } filename={pdfFilename()}>
                       { ({toPdf}) => <Button variant='light' onClick={toPdf}><IoMdDownload size='1.5rem'/></Button> }
                    </ReactToPdf>
                    
                </div>                
                <div className='h-divider' />
                <div className='workout-table'>
                    <div className='workout-row'>
                        <p className='exercise heading'>Exercise</p>
                        <p className='schema heading'>Schema</p>
                        <p className='recovery heading'>Recovery</p>
                        <p className='description heading'>Description</p>
                    </div>
                    { renderAllWorkoutItems() }
                </div>
                <div className='h-divider' />
                <div className='feedback-buttons-container d-flex'>
                    {/* CONDITIONAL BUTTON THAT SHOWS ONLY IF USER IS A CLIENT AND HAS NOT COMPLETED THEIR WORKOUT */}
                    { userIsTrainer || trainingSession.is_complete ? null: 
                    <Button 
                        onClick={ toggleCompleteWorkoutForm }
                        variant={ showCompleteWorkoutForm ? 'secondary' : 'primary' }>
                            { showCompleteWorkoutForm ? 'Cancel' : 'Complete Workout' }
                    </Button> }
                    { showCompleteWorkoutForm ? 
                    <Button 
                        onClick={ handleSubmitFeedback }
                        variant='primary'>
                            Submit Feedback
                    </Button> : null }
                </div>
                
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
                    <Form.Control 
                        as='select'
                        onChange={ handleRatingChange }
                        isInvalid={ !!feedbackErrors.rating }>
                        <option value={ null }>select an option</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        { feedbackErrors.rating }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Leave Feedback</Form.Label>
                    <Form.Control 
                        as='textarea' 
                        rows={3} 
                        onChange={ handleFeedbackChange }
                        isInvalid={ !!feedbackErrors.feedback } />
                    <Form.Control.Feedback type='invalid'>
                        { feedbackErrors.feedback }
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>
        )
    }

    const renderClientFeedback = () => {
        return (
            <div className='feedback-container d-flex'>
                <h3>Client Feedback:</h3>
                <p>{ trainingSession.feedback }</p>
            </div>
        )
    }

// ===========================================
//          RETURN OF REACT COMPONENT
// ===========================================

    return (
        <Modal size="lg" show={show} onHide={handleOnHide} aria-labelledby="training-session-title">
            <Modal.Header className='training-session-header' closeButton>
                { renderTrainingSessionHeader() }
            </Modal.Header>
            <Modal.Body className='training-session-body' ref={ ref }>
                { trainingSession ? renderTrainingSessionBody() : null }
                { showCompleteWorkoutForm ? renderCompleteWorkoutForm() : null } 
                { userIsTrainer && trainingSession && trainingSession.is_complete ? renderClientFeedback() : null } 
            </Modal.Body>
      </Modal>
    );
}

const BicepStar = ({ size, checked }) => {
    return (
        <GiBiceps size={ size } style={ checked ? {color: 'gold'} : {color: 'gray'} }/>
    )
}

const addDispatchToProps = dispatch => {
    return {
        updateTrainingSession: (params) => dispatch(updateTrainingSessionInAgreement( params ))
    }
}

export default connect(null, addDispatchToProps)(TrainingSessionModal);
