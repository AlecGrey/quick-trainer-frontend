import React, { useState, useEffect } from 'react';
import { addAgreement } from '../actions/agreements';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'
import SuccessModal from './SuccessModal';

const NewTrainingAgreement = ({ addAgreement, closeTrainingAgreement }) => {

    // STATE HOOKS FOR POPUP MODALS
    const [ successMessage, setSuccessMessage ] = useState(null)
    // STATE HOOKS FOR FORM DATASET
    const [ coaches, setCoaches ] = useState([])
    // STATE HOOKS FOR NEW AGREEMENT
    const [ selectedCoachId, setSelectedCoachId ] = useState(null)
    const [ sessionsCount, setSessionsCount ] = useState(null)
    const [ intent, setIntent ] = useState(null)

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

    const submitNewAgreement = e => {
        // SUBMITS INFORMATION TO BACKEND
        if ( invalidAgreement() ) return alert('Invalid Agreement!')
        postNewAgreement()
    }

    const invalidAgreement = () => {
        return (
            selectedCoachId === null ||
            sessionsCount === null || sessionsCount === 0 || sessionsCount === '' ||
            intent === null || intent === ''
        )
    }

    const postNewAgreement = () => {
        const url = 'http://localhost:5000/coach-client/create'
        const params = newAgreementParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(addNewUserAgreementToStore)
    }

    const addNewUserAgreementToStore = json => {
        if ( !!json.error ) return // ADD USE OF ERROR MODAL FOR ERROR HANDLING!
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
            body: JSON.stringify({ selectedCoachId, sessionsCount, intent })
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
                <h3>Select a Coach</h3>
                <CoachCardGroup 
                    coaches={ coaches }
                    selectedCoachId={ selectedCoachId }
                    setSelectedCoachId={ setSelectedCoachId }
                />
            </div>
            <div>
                {/* REST OF THE FORM */}
                <h3>Additional Information</h3>
                <AdditionalInformationForm 
                    setSessionsCount={ setSessionsCount }
                    setIntent={ setIntent }
                />
            </div>
            <Button onClick={ submitNewAgreement } variant='primary'>Submit Agreement</Button>
            <SuccessModal 
                successMessage={ successMessage }
                resetSuccessMessage={ handleHideSuccessMessage }
            />
        </div>
    );
}

// ==============================
// CONTAINER FOR ALL COACH CARDS
// ==============================

const CoachCardGroup = ({ coaches, selectedCoachId, setSelectedCoachId }) => {

    const [ page, setPage ] = useState(0)

    const renderCards = () => {
        const start = page * 3
        const end = start + 3
        return coaches.slice( start, end ).map((coach, i) => {
            return <CoachCard 
                    coach={ coach } 
                    setSelectedCoachId={ setSelectedCoachId }
                    selectedCoachId={ selectedCoachId }
                    key={ i }
                />
        })
    }

    const changePageDown = e => setPage( page - 1 )
    const changePageUp = e => setPage( page + 1 )

    return (
        <div className='card-container d-flex'>
            { page === 0 ? <p className='card-group-link'>PREVIOUS</p> : 
                <p onClick={ changePageDown } className='card-group-link clickable'>PREVIOUS</p> }
            <CardGroup>
                { renderCards() }
            </CardGroup>
            { page < ((coaches.length % 3) - 1) ? <p onClick={ changePageUp } className='card-group-link clickable'>NEXT</p> : 
                <p className='card-group-link'>NEXT</p> }
        </div>
        
    )
}

// =============================
// SINGLE COACH CARD COMPONENT
// =============================

const CoachCard = ({ coach, setSelectedCoachId, selectedCoachId }) => {

    const coachIsSelected = () => {
        return coach.id === selectedCoachId
    }

    const handleOnClick = e => {
        coachIsSelected() ? setSelectedCoachId(null) : setSelectedCoachId(coach.id)
    }

    return (
        <Card onClick={ handleOnClick } className={ coachIsSelected() ? 'selected-card' : null }>
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

const AdditionalInformationForm = ({ setSessionsCount, setIntent }) => {

    const changeSessionCount = e => setSessionsCount( parseInt(e.target.value) )
    const changeIntent = e => setIntent( e.target.value )

    return (
        <Form>
            <Form.Group as={Row}>
                <Col sm={3}>
                    <Form.Label>Initial Session Count</Form.Label>
                    <Form.Control type='number' onChange={ changeSessionCount } />
                </Col>
                <Col>
                    <Form.Label>Why are you interested in training?</Form.Label>
                    <Form.Control as='textarea' rows={1} onChange={ changeIntent } />
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
