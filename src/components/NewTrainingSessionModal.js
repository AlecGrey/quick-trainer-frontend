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

    // CONTROLLING STATE FROM COMPONENT VALUES
    const changeName = e => setName(e.target.value)
    const changeDescription = e => setDescription(e.target.value)
    // HIDE MODAL ON EXIT CLICK OR ESCAPE
    const handleOnHide = e => setShow(false)
    // ADDS WORKOUT ITEM FORM ON BUTTON CLICK
    const addNewWorkoutItem = e => {
        setWorkoutItems([
            ...workoutItems, blankWorkoutItem
        ])
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
    }
    // CREATE A WORKOUT FORM, DIVIDED BY A DIV, FOR EVERY WORKOUT ITEM IN STATE
    const renderNewExerciseForms = () => {
        return workoutItems.map(( item, i ) => {
            return (
                <>
                    <div key={ i * 1000 } className='h-divider' />
                    <NewExerciseForm 
                        key={ item }
                        updateWorkoutItem={ updateWorkoutItem }
                        index={ i } 
                    />
                </>
            )
        })
    }

    const submitWorkout = e => {
        const url = 'http://localhost:5000/training-sessions/create'
        const params = submitWorkoutParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleFetchResponse)
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
                        <Form.Control type="text" placeholder="Enter name" onChange={ changeName }/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={2} placeholder="Enter description" onChange={ changeDescription }/>
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

const NewExerciseForm = ({ index, updateWorkoutItem }) => {

    const [ exercise, setExercise ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ sets, setSets ] = useState('')
    const [ repetitions, setRepetititons ] = useState('')
    const [ duration, setDuration ] = useState('')
    const [ useDuration, setUseDuration ] = useState(false)
    const [ resistance, setResistance ] = useState('')
    const [ restInterval, setRestInterval ] = useState('')

    useEffect(() => {
        const payload = {
            index,
            newWorkoutItem: { exercise, description, sets, repetitions, duration, resistance, restInterval }
        }
        updateWorkoutItem(payload)
    }, [ exercise, description, sets, repetitions, duration, resistance, restInterval ])
        
    const changeExercise = e => setExercise( e.target.value )
    const changeDescription = e => setDescription( e.target.value )
    const changeSets = e => setSets( e.target.value )
    const changeResistance = e => setResistance( e.target.value )
    const changeRestInterval = e => setRestInterval( e.target.value )
    
    const ChangeRepetitions = e => {
        useDuration ? setDuration( e.target.value ) : setRepetititons( e.target.value )
    }
    const changeRepetitionType = e => {
        const newUseDuration = e.target.value === 'duration'
        if ( useDuration === newUseDuration ) return
        
        if ( newUseDuration ) {
            setDuration( repetitions )
            setRepetititons( null )
            setUseDuration( true )
        } else {
            setRepetititons( duration )
            setDuration( null )
            setUseDuration( false )
        }
    }

    return (
        <Form>
            <Form.Group as={Row}>
                <Col>
                    <Form.Control type='text' placeholder='Exercise' onChange={changeExercise} />
                </Col>
                <Col>
                    <Form.Control type='text' placeholder='description' onChange={changeDescription} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col>
                    <Form.Control sm={1} type='number' placeholder='Sets' onChange={changeSets} />
                </Col>
                <Col>
                    <Form.Control sm={1} type='number' placeholder='Reps' onChange={ChangeRepetitions} />
                </Col>
                <Col>
                    <Form.Control sm={2} as='select' onChange={ changeRepetitionType }>
                        <option>reps</option>
                        <option>duration</option>
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Control type='number' placeholder='Resistance' onChange={ changeResistance }/>
                </Col>
                <Col>
                    <Form.Control type='number' placeholder='Rest'  onChange={changeRestInterval}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
            </Form.Group>
        </Form>
    )
}

const blankWorkoutItem = {
    exercise: '',
    description: '',
    sets: '',
    repetitions: '',
    duration: '',
    resistance: '',
    restInterval: ''
}

const mapDispatchToProps = dispatch => {
    return {
        addTrainingSessionToAgreement: (params) => dispatch(addTrainingSessionToAgreement(params))
    }
}

export default connect( null, mapDispatchToProps )(NewTrainingSessionModal);
