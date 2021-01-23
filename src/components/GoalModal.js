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

        const url = `http://localhost:5000/goals/${goal.id}`
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
        return (
            <>
                <div className='description-container d-flex'>
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
                            <div className='d-flex'>
                                <Button variant='danger' onClick={ cancelChanges }>Cancel</Button>
                                <Button variant='primary'onClick={ submitChanges }>Submit Changes</Button>
                            </div>
                        </> : null
                    }
                </Form>
            </>
        )
    }

    const classNameByGoalStatus = () => {
        // SET LOGIC FOR CONDITIONAL COLORING
        return
    }

    return (
        <Modal show={show} onHide={handleOnHide} aria-labelledby="goal-title">
            <Modal.Header className='goal-header' closeButton>
                <Modal.Title id='goal-title'>{ goal ? goal.name : null }</Modal.Title>
                <p className={ classNameByGoalStatus() }>{ goal && goal.is_complete ? 'Complete' : 'Not-complete' }</p>
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
