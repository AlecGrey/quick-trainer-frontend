import React, { useState, useEffect } from 'react';
// REACT BOOTSTRAP COMPONENTS
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// REDUX ACTION AND CONNECT
import { updateGoalInAgreement } from '../actions/agreements';
import { connect } from 'react-redux';

const GoalModal = ({ show, setShow, goals, id, setId, userIsTrainer, updateGoalInAgreement, setErrorMessage, setSuccessMessage }) => {
    
    const [ goal, setGoal ] = useState({})
    const [ showFormDetails, setShowFormDetails ] = useState(false)
    const [ goalUpdates, setGoalUpdates ] = useState({})

    useEffect(()=> {
        if ( !!goal ) setGoalUpdates({ is_complete: goal.is_complete, description: goal.description })
    },[ goal ])

    useEffect(() => {
        if ( id === null ) setGoal({})
        else setGoal( findGoalById(id) )
    }, [ id, goals ])


    const handleOnHide = event => {
        resetGoal()
        
    }

    const resetGoal = () => {
        setShow(false)
        setId(null)
        setGoal({})
        setShowFormDetails(false)
    }

    const findGoalById = goalId => {
        return goals.find( goal => goal.id === parseInt(goalId) )
    }

    const fetchUpdateGoal = optionalBody => {
        let body
        if (optionalBody) body = optionalBody
        else body = goalUpdates

        const url = `https://quick-trainer-backend.herokuapp.com/goals/${goal.id}`
        const params = updateGoalParams(body)
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleUpdateGoalResponse)
    }

    const handleUpdateGoalResponse = json => {
        if (!!json.errors) {
            resetGoal()
            setErrorMessage('Unable to update goal, please try again.')
        } else {
            updateGoalInAgreement(json)
            resetGoal()
            setSuccessMessage('Goal successfully updated!')
        }
    }

    const updateGoalParams = payload => {
        return {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(payload)
          }
    }

    const renderGoalBody = () => {

        const formattedCompleteByDate = () => {
            const date = goal.complete_by_date.split('-')
            return `${date[1]}/${date[2]}/${date[0]}`
        }

        const formattedCompletedOnDate = () => {
            const date = goal.updated_at.split('T')[0].split('-')
            return `${date[1]}/${date[2]}/${date[0]}`
        }

        const goalCompletionDate = () => {
            if ( goal && goal.complete_by_date ) {
                return goal.is_complete ? formattedCompletedOnDate() : formattedCompleteByDate()
            }
        }

        return (
            <>
                <div className='description-container d-flex justify-content-between'>
                    <div className='goal-status-container d-flex'>
                      <h3>Status:</h3>
                      <p>{ goal.is_complete ? 'Complete': 'Not-complete' }</p>  
                    </div>
                    <div className='date-container d-flex align-items-center'>
                        <h3 className='date'>{ goal.is_complete ? 'Completed on:' : 'Complete by:' }</h3>
                        <p className='date'>{ goalCompletionDate() }</p>
                    </div>
                </div>
                <div className='description-container d-flex align-items-center'>
                    <h3>Description:</h3>
                    <p>{ goal.description }</p>
                </div>
            </>
        )
    }

    const renderCompleteGoalForm = () => {

        const handleCheckboxClick = e => {
            setShowFormDetails(true)
            setGoalUpdates({
                ...goalUpdates, 
                is_complete: !goalUpdates.is_complete
            })
        }

        const handleDescriptionChange = e => {
            const newValue = e.target.value
            setGoalUpdates({ ...goalUpdates, description: newValue })
        }

        const cancelChanges = e => {
            setGoalUpdates({ 
                is_complete: goal.is_complete, 
                description: goal.description 
            })
            setShowFormDetails(false)
        }

        const submitChanges = e => {
            fetchUpdateGoal()
        }

        return (
            <>
                <Form className='complete-goal-form'>
                    <Form.Group>
                        <Form.Check 
                            inline 
                            label='Goal is Complete'
                            onClick={ handleCheckboxClick }
                            checked={ goalUpdates.is_complete }
                            disabled={ showFormDetails }
                        />
                    </Form.Group>
                    { 
                    showFormDetails ? 
                        <>
                            <Form.Group>
                                <Form.Label>Update Description <em>{ '(optional)' }</em></Form.Label>
                                <Form.Control as='textarea' onChange={ handleDescriptionChange } value={ goalUpdates.description } />
                            </Form.Group>
                            <div className='d-flex' style={{ marginBottom: '0.5rem' }}>
                                <Button variant='danger' onClick={ cancelChanges }>Cancel</Button>
                                <Button variant='primary'onClick={ submitChanges }>Submit Changes</Button>
                            </div>
                        </> : null
                    }
                </Form>
            </>
        )
    }

    const formattedDate = () => {
        const date = goal.created_at.split('T')[0].split('-')
        return `${date[1]}/${date[2]}/${date[0]}`
    }

    return (
        <Modal show={show} onHide={handleOnHide} aria-labelledby="goal-title">
            <Modal.Header className='goal-header' closeButton>
                <Modal.Title id='goal-title'>{ goal ? goal.name : 'Loading...' }</Modal.Title>
                <p>date:</p>
                <h3>{ goal && goal.created_at ? formattedDate() : 'Loading...' }</h3>
            </Modal.Header>
            <Modal.Body className='goal-body'>
                { goal ? renderGoalBody() : null }
                { userIsTrainer && goalUpdates && goalUpdates.is_complete !== null ? renderCompleteGoalForm() : null }
            </Modal.Body>
      </Modal>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        updateGoalInAgreement: ( params ) => dispatch(updateGoalInAgreement( params ))
    }
}

export default connect( null, mapDispatchToProps )(GoalModal);
