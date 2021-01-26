import React, { useState, useEffect } from 'react';
import { addAgreement } from '../actions/agreements';
import { connect } from 'react-redux';
// REACT BOOTSTRAP COMPONENTS
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'
// REACT-ICONS
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
// COMPONENT DEPENDENCIES
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const NewTrainingAgreement = ({ addAgreement, closeTrainingAgreement }) => {

    // STATE HOOKS FOR POPUP MODALS
    const [ successMessage, setSuccessMessage ] = useState(null)
    const [ errorMessage, setErrorMessage ] = useState(null)
    // STATE HOOKS FOR FORM DATASET
    const [ coaches, setCoaches ] = useState([])
    // STATE HOOKS FOR NEW AGREEMENT
    const [ agreement, setAgreement ] = useState({})
    const [ errors, setErrors ] = useState({})

    // FETCH ALL COACHES WHEN RENDERING THIS COMPONENT
    useEffect(() => {
        fetchAllCoaches()
        // COMPONENT WILL UNMOUNT:
        return () => setCoaches(null)
    }, [])

    const fetchAllCoaches = () => {
        const url = 'http://localhost:5000/users/coaches'
        fetch(url)
            .then(resp => resp.json())
            .then(addCoachesToState)
    }

    const addCoachesToState = json => {
        setCoaches([...json])
    }

    // HANDLE CHANGES TO FORM BY ADDING VALUES TO THE AGREEMENT STATE OBJECT
    const addToAgreement = ( field, value ) => {
        setAgreement({
            ...agreement,
            [field]: value
        })
        resetError(field)
    }

    const resetError = field => {
        setErrors({
            ...errors,
            [field]: null
        })
    }

    // BEFORE POSTING TO DATABASE, CHECK FOR ERRORS AND ADD TO ERRORS STATE OBJECt
    const constructSubmitErrorObject = () => {
        const errorObject = {}
        if ( !agreement.trainer_id ) errorObject.trainer_id = 'Please select a coach!'
        if ( !agreement.sessions_remaining ) errorObject.sessions_remaining = 'Cannot be blank!'
        else if ( parseInt(agreement.sessions_remaining) <= 0 ) errorObject.sessions_remaining = 'Must request at least 1 session!'
        if ( isEmptyOrSpaces(agreement.intent) ) errorObject.intent = 'Cannot be blank!'
        return errorObject
    }

    const isEmptyOrSpaces = str => {
        return !str || str.match(/^ *$/) !== null;
    }

    // EVENT HANDLER ON SUBMIT. CHECKS FIRST FOR ERRORS AND ADDS TO STATE
    // IF NO ERRORS, WILL POST AGREEMENT TO DATABASE
    const submitNewAgreement = e => {
        // SUBMITS INFORMATION TO BACKEND
        // ADD ERROR HANDLING HERE
        const newErrors = constructSubmitErrorObject()
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors({
                ...errors,
                ...newErrors
            })
        } else {
            postNewAgreement()
        }
    }

    const postNewAgreement = () => {
        const url = 'http://localhost:5000/coach-client/create'
        const params = newAgreementParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(addNewUserAgreementToStore)
    }

    const addNewUserAgreementToStore = json => {
        if ( !!json.errors ) setErrorMessage(json.errors)
        else {
            addAgreement(json)
            setSuccessMessage('Your agreement was successfully initiated! Awaiting response from your coach.')
        }
    }

    const newAgreementParams = () => {
        return {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(agreement)
          }
    }

    const handleHideSuccessMessage = () => {
        setSuccessMessage(null)
        closeTrainingAgreement()
    }

    return (
        <div id='new-agreement-container' className='flex-grow-1 d-flex flex-column'>
            <div className='new-agreement-header'>
                {/* MAIN HEADER */}
                <h1>New Training Agreement</h1>
                <div className='h-divider' />
            </div>
            <div>
                {/* SELECT A COACH SECTION */}
                <div className='d-flex justify-content-start align-items-center'>
                    <h3>Select a Coach</h3>
                    { !!errors.trainer_id ? <p className='error'>must select a coach!</p> : null }
                </div>
                <CoachCardGroup 
                    coaches={ coaches }
                    agreement={ agreement }
                    addToAgreement={ addToAgreement }
                    errors={ errors }
                />
            </div>
            <div>
                {/* REST OF THE FORM */}
                <h3>Additional Information</h3>
                <AdditionalInformationForm
                    errors={ errors }
                    addToAgreement={ addToAgreement }
                />
            </div>
            <Button onClick={ submitNewAgreement } variant='primary'>Submit Agreement</Button>
            <SuccessModal 
                successMessage={ successMessage }
                resetSuccessMessage={ handleHideSuccessMessage }
            />
            <ErrorModal 
                errorMessage={ errorMessage }
                resetErrorMessage={ () => setErrorMessage(null) }
            />
        </div>
    );
}

// ==============================
// CONTAINER FOR ALL COACH CARDS
// ==============================

const CoachCardGroup = ({ coaches, agreement, addToAgreement, errors }) => {

    const [ page, setPage ] = useState(0)

    const renderCards = () => {
        const start = page * 3
        const end = start + 3
        return coaches.slice( start, end ).map((coach, i) => {
            return <CoachCard 
                    coach={ coach }
                    addToAgreement={ addToAgreement }
                    selectedCoachId={ agreement.trainer_id }
                    key={ i }
                />
        })
    }

    const changePageDown = e => {
        setPage( page - 1 )
    }
    const changePageUp = e => {
        setPage( page + 1 )
    }

    return (
        <div className='card-container d-flex justify-content-between'>
            <ScrollArrow 
                direction='left' 
                active={ page !== 0 }
                handleClick={changePageDown}
            />
            <CardGroup>
                { renderCards() }
            </CardGroup>
            <ScrollArrow 
                direction='right' 
                active={ page < (coaches.length % 3) - 1}
                handleClick={changePageUp}
            />
        </div>
        
    )
}

const ScrollArrow = ({ direction, active, handleClick }) => {

    const renderActiveArrow = () => {
        if (direction === 'left') return (
            <BsChevronLeft size='5rem' className='left scroll-button clickable' />
        ) 
        else return (
            <BsChevronRight size='5rem' className='right scroll-button clickable' />
        )
    }

    const renderInactiveArrow = () => {
        if (direction === 'left') return (
            <BsChevronLeft size='5rem' className='left scroll-button' />
        ) 
        else return (
            <BsChevronRight size='5rem' className='right scroll-button' />
        )
    }

    const handleArrowClick = e => {
        if (active) handleClick()
    }

    return (
        <div onClick={handleArrowClick} className='arrow-container d-flex align-items-center'>
            { active ? renderActiveArrow() : renderInactiveArrow() }
        </div>
    )
}

// =============================
// SINGLE COACH CARD COMPONENT
// =============================

const CoachCard = ({ coach, addToAgreement, selectedCoachId }) => {

    const coachIsSelected = () => {
        return coach.id === selectedCoachId
    }

    const handleOnClick = e => {
        coachIsSelected() ? addToAgreement('trainer_id', null) : addToAgreement('trainer_id', coach.id)
    }

    return (
        <Card style={{ width: '15rem' }} onClick={ handleOnClick } className={ coachIsSelected() ? 'selected-card' : null }>
            <Card.Img 
                variant="top" 
                src={ coach.image_url } 
            />
            <Card.Body>
                <Card.Title className={ coachIsSelected() ? 'selected-card' : null }>{ coach.name }</Card.Title>
                <div className='h-divider' />
                <div className='d-flex'>
                   <h6>Certification:</h6>
                    <Card.Text>{ coach.credentials }</Card.Text> 
                </div>
                <div className='d-flex'>
                    <h6>Specialty:</h6>
                    <Card.Text>{ coach.specialty }</Card.Text>
                </div>
            </Card.Body>
        </Card>
    )
}

// =============================
// ADDITIONAL INFORMATION FORM
// =============================

const AdditionalInformationForm = ({ errors, addToAgreement }) => {

    return (
        <Form>
            <Form.Group as={Row}>
                <Col sm={3}>
                    <Form.Label>Initial Session Count</Form.Label>
                    <Form.Control 
                        type='number' 
                        onChange={ e => addToAgreement('sessions_remaining', parseInt(e.target.value)) } 
                        isInvalid={ !!errors.sessions_remaining }    
                    />
                    <Form.Control.Feedback type='invalid'>
                        { errors.sessions_remaining }
                    </Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label>Why are you interested in training?</Form.Label>
                    <Form.Control 
                        as='textarea' rows={1} 
                        onChange={ e => addToAgreement('intent', e.target.value) }
                        isInvalid={ !!errors.intent } 
                    />
                    <Form.Control.Feedback type='invalid'>
                        { errors.intent }
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
        </Form>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        addAgreement: (agreementObject) => dispatch(addAgreement(agreementObject))
    }
}

export default connect(null, mapDispatchToProps)(NewTrainingAgreement);
