import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';

const GoalModal = ({ show, setShow, goals, id, setId, userIsTrainer }) => {
    
    const [ goal, setGoal ] = useState(null)

    useEffect(() => {
        if ( id === null ) setGoal(null)
        else setGoal( findGoalById(id) )
    }, [ id ])


    const handleOnHide = event => {
        setShow(false)
        setId(null)
    }

    const findGoalById = goalId => {
        return goals.find( goal => goal.id === parseInt(goalId) )
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

    return (
        <Modal show={show} onHide={handleOnHide} aria-labelledby="goal-title">
            <Modal.Header className='goal-header' closeButton>
                <Modal.Title id='goal-title'>Goal</Modal.Title>
            </Modal.Header>
            <Modal.Body className='goal-body'>
                { goal ? renderGoalBody() : null }
            </Modal.Body>
      </Modal>
    );
}

export default GoalModal;
