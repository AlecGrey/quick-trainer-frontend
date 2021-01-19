import React, { useState, useEffect } from 'react';
import Image from 'react-bootstrap/Image'
import TrainingSessionModal from './TrainingSessionModal';
import GoalModal from './GoalModal';

const AgreementDetails = ({ userIsTrainer, agreement }) => {

    // HOOKS FOR VIEW STATUS OF PAGE MODALS
    const [ showTrainingSession, setShowTrainingSession ] = useState(false)
    const [ showGoal, setShowGoal ] = useState(false)
    // TRAINING SESSION ID REQUIRED FOR FETCH REQUEST
    const [ trainingSessionId, setTrainingSessionId ] = useState(null)
    const [ goalId, setGoalId ] = useState(null)

    const loadPageDetails = () => {
        return (
            <>
                { userIsTrainer ? 
                    <AgreementHeader 
                        name={ agreement.client.name }
                        imageUrl={ agreement.client.image_url }
                        sessionsRemaining={ agreement.sessions_remaining }
                    /> : 
                    <AgreementHeader
                        name={ agreement.trainer.name }
                        imageUrl={ agreement.trainer.image_url }
                        sessionsRemaining={ agreement.sessions_remaining }
                    /> }
                { userIsTrainer ? 
                    <Bio bio={ agreement.client.bio } /> :
                    <Bio bio={ agreement.trainer.bio } /> 
                }
                {
                    userIsTrainer ?
                    <Demographics 
                        height={ agreement.client.height }
                        weight={ agreement.client.weight }
                        birthdate={ agreement.client.date_of_birth }
                    /> : 
                    <Credentials
                        specialty={ agreement.trainer.specialty }
                        certification={ agreement.trainer.credentials }
                    />
                }
                <div className='d-flex justify-content-stretch'>
                    <TrainingSessionsList 
                        trainingSessions={ agreement.training_sessions }
                        userIsTrainer={ userIsTrainer }
                        setShowTrainingSession={ setShowTrainingSession }
                        setTrainingSessionId={ setTrainingSessionId }
                    />
                    <GoalsList
                        goals={ agreement.goals }
                        userIsTrainer={ userIsTrainer }
                        setShowGoal={ setShowGoal }
                        setGoalId={ setGoalId }
                    />
                </div>
                <TrainingSessionModal 
                    show={ showTrainingSession }
                    setShow={ setShowTrainingSession }
                    id={ trainingSessionId }
                    setId={ setTrainingSessionId }
                    userIsTrainer={ userIsTrainer }
                />
                <GoalModal 
                    show={ showGoal }
                    setShow={ setShowGoal }
                    goals={ agreement.goals }
                    id={ goalId }
                    setId={ setGoalId }
                    userIsTrainer={ userIsTrainer }
                />          
            </>
        )
    }

    return (
        <div id='agreement-details-container' className='flex-grow-1 d-flex flex-column align-items-stretch'>
            {
                !agreement ? null : loadPageDetails()
            }
        </div>
    );
}

const AgreementHeader = ({ name, imageUrl, sessionsRemaining }) => {
    return (
        <>
            <div id='agreement-header' className='d-flex align-items-end'>
                <Image className='agreement-image' src={ imageUrl }/>
                <h1 className='display-name flex-grow-1'>{ name }</h1>
                <p className='sessions-remaining'>Sessions Remaining:</p>
                <h1 className='display-remaining-sessions'>{ sessionsRemaining }</h1>
            </div>
            <div className='h-divider'/>
        </>
    )
}

const Bio = ({ bio }) => {
    return (
        <div id='bio-container' className='d-flex'>
            <h3 className='user-bio-header'>Bio</h3>
            <p className='user-bio-content flex-grow-1'>{ bio }</p>
        </div>
    )
}

const Demographics = ({ height, weight, birthdate }) => {

    const birthdateField = () => {
        const dateArray = birthdate.split('-')
        return `${monthConverter[dateArray[1]]} ${dateArray[2]}, ${dateArray[0]} (Age: ${currentAge()})`
    }

    const currentAge = () => {
        const timeOfBirth = new Date( birthdate )
        const diff = new Date( Date.now() - timeOfBirth )
        return diff.getUTCFullYear() - 1970
        
    }

    const monthConverter = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }

    return (
        <div id='demographics-container'>
            <h1>Demographics</h1>
            <div className='h-divider'/>
            <div className='information-grid'>
                <div className='d-flex height'>
                    <h3>Height:</h3>
                    <p>{ height }</p>
                </div>
                <div className='d-flex weight'>
                    <h3>Weight:</h3>
                    <p>{ weight }</p>
                </div>
                <div className='d-flex birthdate'>
                    <h3>Date of Birth:</h3>
                    <p>{ birthdateField() }</p>
                </div>
            </div>
        </div>
    )
}

const Credentials = ({ specialty, certification }) => {
    return (
        <div id='credentials-container'>
            <h1>Credentials</h1>
            <div className='h-divider'/>
            <div className='information-grid'>
                <div className='d-flex certification'>
                    <h3>Certification:</h3>
                    <p>{ certification }</p>
                </div>
                <div className='d-flex specialty'>
                    <h3>Specialty:</h3>
                    <p>{ specialty }</p>
                </div>
            </div>
        </div>
    )
}

const TrainingSessionsList = ({ trainingSessions, userIsTrainer, setShowTrainingSession, setTrainingSessionId }) => {

    const handleOnClick = event => {
        setTrainingSessionId(event.target.id)
        setShowTrainingSession(true)
    }

    const renderSessionListItems = () => {
        return trainingSessions.map( session => {
            return <li
                    key={ session.id }
                    id={ session.id }
                    onClick={ handleOnClick }>{ session.name }</li>
        })
    }

    return (
        <div id='training-sessions-list-container' className='flex-grow-1'>
            <div className='d-flex'>
                <h1>Training Sessions</h1>
                { userIsTrainer ? <p className='create-new-item'>New</p> : null }
            </div>
            <div className='h-divider'/>
            <ul id='training-sessions-list'>
                { renderSessionListItems() }
            </ul>
        </div>
    )
}

const GoalsList = ({ goals, userIsTrainer, setShowGoal, setGoalId }) => {

    const handleOnClick = event => {
        setGoalId(event.target.id)
        setShowGoal(true)
    }

    const renderGoalItems = () => {
        return goals.map( goal => {
            return <li
                    key={ goal.id }
                    id={ goal.id }
                    onClick={ handleOnClick }>{ goal.name }</li>
        })
    }

    return (
        <div id='goals-list-container'>
            <div className='d-flex'>
                <h1>Goals</h1>
                { userIsTrainer ? <p className='create-new-item'>New</p> : null }
            </div>
            <div className='h-divider'/>
            <ul id='goals-list'>
                { renderGoalItems() }
            </ul>
        </div>
    )
}



export default AgreementDetails;
