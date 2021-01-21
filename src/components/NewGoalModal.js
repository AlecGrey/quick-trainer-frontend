import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const NewGoalModal = ({ show, setShow, coachClientId }) => {

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
                                isInvalid={!!errors.description} 
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Button onClick={ submitNewGoal } variant='primary'>Submit Goal</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
// ======================================
// GOAL FIELDS:
// name: string
// description: string
// complete_by_date: date ( YYYY-MM-DD )
// coach_client_id: int
// ======================================

export default NewGoalModal;