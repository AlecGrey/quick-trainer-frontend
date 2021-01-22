import React, { useState } from 'react';
// BOOTSTRAP ITEMS
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// ADD DISPATCH ACTION AND CONNECT
import { addGoalToAgreement } from '../actions/agreements';
import { connect } from 'react-redux';

const NewGoalModal = ({ show, setShow, setSuccessMessage, setErrorMessage, coachClientId, addGoalToAgreement }) => {

    // STATE HOOKS
    const [ name, setName ] = useState('')
    const [ date, setDate ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ errors, setErrors ] = useState({})
    // EVENT HANDLERS
    const handleOnHide = e => setShow(false)

    const changeGoalName = e => {
        setName(e.target.value)
        removeErrors('name')
    }

    const changeGoalDescription = e => {
        setDescription(e.target.value)
        removeErrors('description')
    }

    const changeGoalDate = e => {
        if ( validDate(e.target.value) ) {
            setDate( e.target.value )
            removeErrors('date')
        } else setErrors({
            ...errors,
            date: 'Date must be in the future!'
        })
    }
    const submitNewGoal = e => {
        setNewErrors()
        if ( !formContainsErrors() ) postNewGoalToServer()
    }

    const postNewGoalToServer = () => {
        const url = 'http://localhost:5000/goals/create'
        const params = postNewGoalParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleFetchResponse)
    }

    const handleFetchResponse = json => {
        if (!json.errors) {
            addGoalToAgreement({
                agreementId: coachClientId,
                goal: json
            })
            setShow(false)
            setSuccessMessage('Your goal was created successfully!')
        } else {
            setShow(false)
            setErrorMessage('Sorry, we were unable to create your goal. Please try again.')
        }
    }

    const postNewGoalParams = () => {
        return {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify({ coachClientId, name, date, description })
          }
    }

    const isEmptyOrSpaces = str => {
        return str === null || str.match(/^ *$/) !== null;
    }

    // HELPER METHODS
    const validDate = date => {
        // const [ year, month, day ] = date
        const selectedTime = new Date(date).getTime()
        return selectedTime >= new Date(Date.now()).getTime()
    }

    const removeErrors = field => {
        if ( !!errors[field] ) {
            setErrors({
                ...errors,
                [field]: null
            })
        }
    }

    const setNewErrors = () => {
        if (isEmptyOrSpaces(name)) {
            setErrors({
                ...errors,
                name: 'Cannot be left blank!'
            })
        }
        if (isEmptyOrSpaces(description)) {
            setErrors({
                ...errors,
                description: 'Cannot be left blank!'
            })
        }
        if ( date === '' ) {
            setErrors({
            ...errors,
            date: 'Date must be entered!'
            })
        }
    }
    
    const formContainsErrors = () => {
        return (
            !!errors.name || !!errors.date || !!errors.description
        )
    }

    return (
        <Modal show={ show } onHide={ handleOnHide } aria-labelledby='new-goal-title'>
            <Modal.Header className='new-goal-header' closeButton>
                <Modal.Title id='new-goal-title'>
                    New Training Goal
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='new-goal-body'>
                {/* INSERT FORM HERE */}
                <Form>
                    <Form.Group as={Row}>
                        <Col>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type='text' 
                                onChange={ changeGoalName }
                                isInvalid={!!errors.name} 
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label>Due by Date</Form.Label>
                            <Form.Control 
                                type='date' 
                                onChange={ changeGoalDate } 
                                isInvalid={!!errors.date}
                            />
                            
                            <Form.Control.Feedback type="invalid">
                                {errors.date}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={ 3 }>
                            <Form.Label>Description</Form.Label>
                        </Col>
                        <Col>
                            <Form.Control 
                                as='textarea' 
                                onChange={ changeGoalDescription }
                                isInvalid={ !!errors.description } 
                            />
                            <Form.Control.Feedback type="invalid">
                                { errors.description }
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Button onClick={ submitNewGoal } variant='primary'>Submit Goal</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        addGoalToAgreement: (params) => dispatch(addGoalToAgreement(params))
    }
}

export default connect( null, mapDispatchToProps )(NewGoalModal);