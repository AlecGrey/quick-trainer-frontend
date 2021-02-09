import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// ACTION AND DISPATCH
import { connect } from 'react-redux';
import { addTrainingSessionToAgreement } from '../actions/agreements';

const NewTrainingSessionModal = ({ show, setShow, setErrorMessage, setSuccessMessage, coachClientId, addTrainingSessionToAgreement }) => {

    const [ name, setName ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ workoutItems, setWorkoutItems ] = useState([])
    const [ errors, setErrors ] = useState({ workoutItems: [] })

    // CONTROLLING STATE FROM COMPONENT VALUES
    const changeName = e => {
        setName(e.target.value)
        setErrors({
            ...errors,
            name: null
        })
    }
    const changeDescription = e => {
        setDescription(e.target.value)
        setErrors({
            ...errors,
            description: null
        })
    }
    // HIDE MODAL ON EXIT CLICK OR ESCAPE
    const handleOnHide = e => setShow(false)
    // ADDS WORKOUT ITEM FORM ON BUTTON CLICK
    const addNewWorkoutItem = e => {
        setWorkoutItems([
            ...workoutItems, {}
        ])
        setErrors({
            ...errors,
            workoutItems: [...errors.workoutItems, {}]
        })
    }
    // UPDATE STATE ON WORKOUT ITEMS
    const updateWorkoutItem = ({index, newWorkoutItem}) => {
        const newWorkoutItems = [...workoutItems]
        newWorkoutItems[index] = newWorkoutItem
        setWorkoutItems([...newWorkoutItems])
    }
    // REMOVE LAST WORKOUT ITEM ON BUTTON CLICK
    const removeLastExercise = (index) => {
        const newWorkoutItems = [...workoutItems]
        newWorkoutItems.pop()
        setWorkoutItems([...newWorkoutItems])
        
        const newWorkoutItemsErrors = [...errors.workoutItems]
        newWorkoutItemsErrors.pop()
        setErrors({
            ...errors,
            workoutItems: [...newWorkoutItemsErrors]
        })
    }
    // CREATE A WORKOUT FORM, DIVIDED BY A DIV, FOR EVERY WORKOUT ITEM IN STATE
    const renderNewExerciseForms = () => {
        return workoutItems.map(( item, i ) => {
            return (
                <>
                    <div key={ i } className='h-divider' />
                    <NewExerciseForm 
                        key={ item }
                        updateWorkoutItem={ updateWorkoutItem }
                        index={ i }
                        allErrors={ errors }
                        errors={ errors.workoutItems[i] }
                        setErrors={ setErrors }
                    />
                </>
            )
        })
    }

    const submitWorkout = e => {
        const errors = checkFormForErrors()
        if (errorsPresent(errors)) setErrors(errors)
        else fetchNewWorkout()
    }

    const fetchNewWorkout = () => {
        const url = 'https://quick-trainer-backend.herokuapp.com/training-sessions/create'
        const params = submitWorkoutParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleFetchResponse)
    }

    const errorsPresent = errorObject => {
        if ( !!errorObject.name || !!errorObject.description ) return true
        for (let item of errorObject.workoutItems) {
            if ( !!item.exercise || !!item.description || !!item.sets || !!item.repetitions || !!item.resistance || !!item.restInterval ) return true
        }
        return false
    }

    const checkFormForErrors = () => {
        const errors = { workoutItems: [] }
        if (isEmptyOrSpaces(name)) errors.name = 'Cannot be blank!'
        if (isEmptyOrSpaces(description)) errors.description = 'Cannot be blank!'
        workoutItems.forEach( (item, i) => {
            const itemErrors = checkWorkoutItemForErrors(item)
            errors.workoutItems[i] = itemErrors
        })
        return errors
    }

    const checkWorkoutItemForErrors = item => {
        const errors = {}
        if (isEmptyOrSpaces(item.exercise)) errors.exercise = 'Cannot be blank!'
        if (isEmptyOrSpaces(item.description)) errors.description = 'Cannot be blank!'
        if (!item.sets) errors.sets = 'Cannot be blank!'
        else if (item.sets < 1) errors.sets = 'Must be more than 0!'
        if (!item.repetitions && !item.duration) errors.repetitions = 'Cannot be blank!'
        else if (!item.repetitions && item.duration < 1) errors.repetitions = 'Must be more than 0!'
        else if (!item.duration && item.repetitions < 1) errors.repetitions = 'Must be more than 0!'
        if (!item.restInterval) errors.restInterval = 'Cannot be blank!'
        else if (item.restInterval < 1) errors.restInterval = 'Must be more than 0!'
        return errors
    }

    const isEmptyOrSpaces = str => {
        return !str || str.match(/^ *$/) !== null;
    }

    const handleFetchResponse = json => {
        if (!json.errors) {
            addTrainingSessionToAgreement({
                agreementId: coachClientId,
                trainingSession: json
            })
            setShow(false)
            setSuccessMessage('Your session was created successfully!')
        } else {
            setShow(false)
            setErrorMessage('Sorry, we were unable to create your workout. Please try again.')
        }
        

    }

    const submitWorkoutParams = () => {
        return {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify({ name, description, workoutItems, coachClientId })
        }
    }

    return (
        <Modal size="lg" show={show} onHide={handleOnHide} aria-labelledby="new-training-session-title">
            <Modal.Header className='new-training-session-header' closeButton>
            <Modal.Title id="new-training-session-title">New Training Session</Modal.Title>
            </Modal.Header>
            <Modal.Body className='new-training-session-body'>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter name" 
                            onChange={ changeName }
                            isInvalid={ !!errors.name }
                        />
                        <Form.Control.Feedback type='invalid'>{ errors.name }</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={2} placeholder="Enter description" 
                            onChange={ changeDescription }
                            isInvalid={ !!errors.description }
                        />
                        <Form.Control.Feedback type='invalid'>{ errors.description }</Form.Control.Feedback>
                    </Form.Group>
                </Form>
                <h3 className='exercises-header'>Exercises</h3>
                { renderNewExerciseForms() }
                <div className='h-divider' />
                <Button onClick={ addNewWorkoutItem } variant='success'>Add an Exercise</Button>
                { workoutItems.length === 0 ? null :
                    <Button onClick={ removeLastExercise } variant='danger'>Remove last Exercise</Button>
                }
                <Button className='submit-button' onClick={ submitWorkout } variant='primary'>Submit Workout</Button>
            </Modal.Body>
      </Modal>
    );
}

const NewExerciseForm = ({ index, updateWorkoutItem, allErrors, errors, setErrors }) => {

    const [ workoutItem, setWorkoutItem ] = useState({})
    const [ repType, setRepType ] = useState('repetitions')

    const setField =( field, e ) => {
        setWorkoutItem({
            ...workoutItem,
            [field]: e.target.value
        })
        // debugger
        const newErrors = [...allErrors.workoutItems]
        newErrors[index][field] = null
        setErrors({
            ...allErrors,
            workoutItems: [...newErrors]
        })
    }

    useEffect(() => {
        updateWorkoutItem({ index, newWorkoutItem: workoutItem })
    }, [ workoutItem ])
    
    const changeRepetitionType = e => {
        if (e.target.value === 'repetitions') setWorkoutItem({
            ...workoutItem,
            repetitions: workoutItem.duration,
            duration: null
        })
        else if (e.target.value === 'duration') setWorkoutItem({
            ...workoutItem,
            duration: workoutItem.repetitions,
            repetitions: null
        })
        setRepType(e.target.value)
    }

    return (
        <Form>
            <Form.Group as={Row}>
                <Col>
                    <Form.Control 
                        type='text' 
                        placeholder='Exercise' 
                        onChange={ e => setField('exercise', e)}
                        isInvalid={ !!errors.exercise }
                    />
                    <Form.Control.Feedback type='invalid'>{ errors.exercise }</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Control 
                        type='text' 
                        placeholder='description' 
                        onChange={e => setField('description', e)}
                        isInvalid={ !!errors.description }
                    />
                    <Form.Control.Feedback type='invalid'>{ errors.description }</Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col>
                    <Form.Control 
                        sm={1} 
                        type='number' 
                        placeholder='Sets' 
                        onChange={e => setField('sets', e)}
                        isInvalid={ !!errors.sets }
                    />
                    <Form.Control.Feedback type='invalid'>{ errors.sets }</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Control 
                        sm={1} 
                        type='number' 
                        placeholder='Reps' 
                        onChange={e => setField( repType, e )}
                        isInvalid={ !!errors.repetitions }
                    />
                    <Form.Control.Feedback type='invalid'>{ errors.repetitions }</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Control sm={2} as='select' onChange={ changeRepetitionType }>
                        <option value='repetitions'>reps</option>
                        <option value='duration'>duration</option>
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Control 
                        type='number' 
                        placeholder='Resistance' 
                        onChange={e => setField('resistance', e)}
                        isInvalid={ !!errors.resistance }
                    />
                    <Form.Control.Feedback type='invalid'>{ errors.resistance }</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Control 
                        type='number' 
                        placeholder='Rest'
                        onChange={e => setField('restInterval', e)}
                        isInvalid={ !!errors.restInterval }
                    />
                    <Form.Control.Feedback type='invalid'>{ errors.restInterval }</Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
            </Form.Group>
        </Form>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        addTrainingSessionToAgreement: (params) => dispatch(addTrainingSessionToAgreement(params))
    }
}

export default connect( null, mapDispatchToProps )(NewTrainingSessionModal);
