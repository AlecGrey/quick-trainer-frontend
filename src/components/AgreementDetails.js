import React, { useState } from 'react';
// REACT BOOTSTRAP COMPONENTS
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button';
// DEPENDENT COMPONENTS
import TrainingSessionModal from './TrainingSessionModal';
import GoalModal from './GoalModal';
import NewTrainingSessionModal from './NewTrainingSessionModal';
import NewGoalModal from './NewGoalModal';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import PlaceholderImage from './PlaceholderImage';
// REACT REDUX AND ACTIONS
import { updateAgreement } from '../actions/agreements';
import { connect } from 'react-redux';

const AgreementDetails = ({ userIsTrainer, agreement, updateAgreement }) => {

    // HOOKS FOR VIEW STATUS OF PAGE MODALS
    const [ showTrainingSession, setShowTrainingSession ] = useState(false)
    const [ showGoal, setShowGoal ] = useState(false)
    const [ showNewTrainingSession, setShowNewTrainingSession ] = useState(false)
    const [ showNewGoal, setShowNewGoal ] = useState(false) 
    // TRAINING SESSION ID REQUIRED FOR FETCH REQUEST
    const [ trainingSessionId, setTrainingSessionId ] = useState(null)
    const [ goalId, setGoalId ] = useState(null)
    const [ successMessage, setSuccessMessage ] = useState(null)
    const [ errorMessage, setErrorMessage ] = useState(null)
    // LOCAL EVENT HANDLERS
    const resolveAgreement = status => {
        const resolution = status === 'ACCEPT'
        fetchUpdateAgreement(resolution)
    }

    const fetchUpdateAgreement = resolution => {
        const url = `https://quick-trainer-backend.herokuapp.com/coach-client/${agreement.id}`
        const params = updateAgreementParams(resolution)
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleFetchResponse)
    }

    const handleFetchResponse = json => {
        if (!json.errors) {
            updateAgreement(json)
            const successStatus = json.accepted_agreement ? 'accepted' : 'declined'
            setSuccessMessage(`You have successfully ${successStatus} the agreement.`)
        } else {
            setErrorMessage('We were unable to send your response, please try again.')
        }
    }

    const updateAgreementParams = resolution => {
        return {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify({
                accepted_agreement: resolution
            })
          }
    }

    const loadPageDetails = () => {
        return (
            <>
                { userIsTrainer ? 
                    <AgreementHeader 
                        name={ agreement.client.name }
                        imageUrl={ agreement.client.image_url }
                        sessionsRemaining={ agreement.sessions_remaining }
                        pending={ !agreement.accepted_agreement }
                    /> : 
                    <AgreementHeader
                        name={ agreement.trainer.name }
                        imageUrl={ agreement.trainer.image_url }
                        sessionsRemaining={ agreement.sessions_remaining }
                        pending={ !agreement.accepted_agreement }
                    /> }
                { userIsTrainer ? 
                    <Bio bio={ agreement.client.bio } /> :
                    <Bio bio={ agreement.trainer.bio } /> 
                }
                { agreement.accepted_agreement === null ?
                    <Intent intent={ agreement.intent } /> : null
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
                { !!agreement.accepted_agreement ? showSessionsAndGoalsIfAccepted() : pendingAgreementButtons() }
                <TrainingSessionModal 
                    show={ showTrainingSession }
                    setShow={ setShowTrainingSession }
                    id={ trainingSessionId }
                    setId={ setTrainingSessionId }
                    userIsTrainer={ userIsTrainer }
                    setSuccessMessage={ setSuccessMessage }
                    setErrorMessage={ setErrorMessage }
                />
                <GoalModal 
                    show={ showGoal }
                    setShow={ setShowGoal }
                    goals={ agreement.goals }
                    id={ goalId }
                    setId={ setGoalId }
                    userIsTrainer={ userIsTrainer }
                    setErrorMessage={ setErrorMessage }
                    setSuccessMessage={ setSuccessMessage }
                />
                <NewTrainingSessionModal 
                    show={ showNewTrainingSession }
                    setShow={ setShowNewTrainingSession }
                    coachClientId={ agreement.id }
                    setSuccessMessage={ setSuccessMessage }
                    setErrorMessage={ setErrorMessage }
                />
                <NewGoalModal 
                    show={ showNewGoal }
                    setShow={ setShowNewGoal }
                    coachClientId={ agreement.id }
                    setSuccessMessage={ setSuccessMessage }
                    setErrorMessage={ setErrorMessage }
                />
                <SuccessModal 
                    successMessage={ successMessage }
                    resetSuccessMessage={ () => setSuccessMessage(null) }
                />
                <ErrorModal 
                    errorMessage={ errorMessage }
                    resetErrorMessage={ () => setErrorMessage(null) }
                />
            </>
        )
    }

    const showSessionsAndGoalsIfAccepted = () => {

        const timeFromDate = createdAtDate => {
            return new Date(createdAtDate).getTime()
        }

        const sortByCreatedAtDate = arrayOfObjects => {
            return arrayOfObjects.sort((a, b) => {
                if (timeFromDate(a.created_at) > timeFromDate(b.created_at)) return -1
                else if (timeFromDate(a.created_at) < timeFromDate(b.created_at)) return 1
                else return 0
            })
        }

        return (
            <div className='d-flex justify-content-stretch'>
                <TrainingSessionsList 
                    trainingSessions={ sortByCreatedAtDate(agreement.training_sessions) }
                    userIsTrainer={ userIsTrainer }
                    setShowTrainingSession={ setShowTrainingSession }
                    setTrainingSessionId={ setTrainingSessionId }
                    setShowNewTrainingSession={ setShowNewTrainingSession }
                />
                <GoalsList
                    goals={ sortByCreatedAtDate(agreement.goals) }
                    userIsTrainer={ userIsTrainer }
                    setShowGoal={ setShowGoal }
                    setGoalId={ setGoalId }
                    setShowNewGoal={ setShowNewGoal }
                />
            </div>
        )
    }

    const pendingAgreementButtons = () => {
        if (!userIsTrainer) return null
        return (
            <div id='pending-agreement-buttons' className='d-flex'>
                <Button 
                    variant='success' 
                    onClick={ () => resolveAgreement('ACCEPT') }
                >
                    Accept Agreement
                </Button>
                <Button 
                    variant='danger'
                    onClick={ () => resolveAgreement('DECLINE') }
                >
                    Decline Agreement
                </Button>
            </div>
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

const AgreementHeader = ({ name, imageUrl, sessionsRemaining, pending }) => {
    return (
        <>
            <div id='agreement-header' className='d-flex align-items-end'>
                { !!imageUrl ? 
                    <Image className='agreement-image' src={ imageUrl }/> :
                    <PlaceholderImage size='78px' padding='10px' noShadow={true}/>
                }
                <h1 className='display-name flex-grow-1'>{ name }</h1>
                <p className='sessions-remaining'>{ pending ? 'Sessions Requested:' : 'Sessions Remaining:' }</p>
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

const Intent = ({ intent }) => {
    return (
        <div id='intent-container' className='d-flex'>
            <h3 className='user-intent-header'>Training Intent</h3>
            <p className='user-intent-content flex-grow-1'>{ intent }</p>
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
                    <p>{ !!height ? height : 'Not reported' }</p>
                </div>
                <div className='d-flex weight'>
                    <h3>Weight:</h3>
                    <p>{ !!weight ? weight : 'Not reported' }</p>
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

const TrainingSessionsList = ({ trainingSessions, userIsTrainer, setShowTrainingSession, setTrainingSessionId, setShowNewTrainingSession }) => {

    const handleOnClick = event => {
        setTrainingSessionId(event.target.id)
        setShowTrainingSession(true)
    }

    const handleNewClick = e => setShowNewTrainingSession(true)

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
                { userIsTrainer ? 
                    <p className='create-new-item' onClick={ handleNewClick }>New</p> : null 
                }
            </div>
            <div className='h-divider'/>
            <ul id='training-sessions-list'>
                { trainingSessions.length > 0 ? renderSessionListItems() :
                    <h4>No training sessions to show</h4>
                }
            </ul>
        </div>
    )
}

const GoalsList = ({ goals, userIsTrainer, setShowGoal, setGoalId, setShowNewGoal }) => {

    const handleOnClick = event => {
        setGoalId(event.target.id)
        setShowGoal(true)
    }

    const handleNewClick = e => setShowNewGoal(true)

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
                { userIsTrainer ? <p onClick={ handleNewClick } className='create-new-item'>New</p> : null }
            </div>
            <div className='h-divider'/>
            <ul id='goals-list'>
                { goals.length > 0 ? renderGoalItems() :
                    <h4>No goals have been made</h4>
                }
            </ul>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        updateAgreement: (agreement) => dispatch(updateAgreement( agreement ))
    }
}

export default connect( null, mapDispatchToProps )(AgreementDetails);