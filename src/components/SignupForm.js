import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SignupForm = ({ setShowSignup, sendUserToStore, navigateToHomePage }) => {
    // SWITCH VIEW BACK TO LOGIN PAGE
    const handleGoBack = e => setShowSignup(false)
    // STATE HOOKS
    const [ user, setUser ] = useState({})
    const [ errors, setErrors ] = useState({})

    // EVENT HANDLERS
    const handleFieldChange = (field, value) => {
        if (field === 'is_trainer') {
            const { name, password, password_confirmation } = user
            setUser({ name, password, password_confirmation, [field]: value })
        } else {
            setUser({ ...user, [field]: value })
        }
        resetError(field)
    }

    // ON FORM SUBMISSION EVENT
    const handleSignupSubmit = e => {
        // ADD ERROR HANDLING ON FORM SUBMISSION!
        const newErrors = constructErrors()
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors({
                ...errors,
                ...newErrors
            })
        } else {
            newUserFetch()
        }
    }

    const newUserFetch = () => {
        // This fetch takes advantage of two callback functions from the login page:
        // handleUserFetch and navigateToHomePage
        const url = 'http://localhost:5000/signup'
        const params = newUserParams()
        console.log('fetching...')
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleSignupFetch)
            .then(navigateToHomePage)
    }

    const handleSignupFetch = json => {
        if ( !!json.errors ) setErrors({ ...errors, ...json.errors })
        else {
            sendUserToStore(json)
        }
        return !json.errors
    }

    const newUserParams = () => {
        return {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        }
    }


    // HELPER METHODS
    const resetError = field => {
        setErrors({
            ...errors,
            [field]: null
        })
    }

    const constructErrors = () => {
        // CONSTRUCT AND RETURN ARRAY OF ALL ERRORS
        const { is_trainer, name, password, password_confirmation, specialty, credentials, date_of_birth } = user
        const errorObject = {}
        // FIELDS CANNOT BE BLANK!
        if ( isEmptyOrSpaces(name) ) errorObject.name = 'Cannot be blank!'
        if ( is_trainer && isEmptyOrSpaces(specialty) ) errorObject.specialty = 'Cannot be blank!'
        if ( is_trainer && isEmptyOrSpaces(credentials) ) errorObject.credentials = 'Cannot be blank!'
        if ( isEmptyOrSpaces(date_of_birth) ) errorObject.date_of_birth = 'Cannot be blank!'
        // ONLY DISPLAY A SINGLE ERROR FOR PASSWORD FIELDS
        if ( isEmptyOrSpaces(password) ) errorObject.password = 'Cannot be blank!'
        else if ( isEmptyOrSpaces(password_confirmation) ) errorObject.password_confirmation = 'Cannot be blank!'
        else if ( password !== password_confirmation ) errorObject.password_confirmation = 'Passwords must match!'
        return errorObject
    }

    const isEmptyOrSpaces = str => {
        return !str || str.match(/^ *$/) !== null;
    }

    // SUBCOMPONENTS
    const renderClientForm = () => {
        return (
            <>
                <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control 
                        type='date'
                        onChange={ e => handleFieldChange( 'date_of_birth', e.target.value ) }
                        isInvalid={ !!errors.date_of_birth }
                    />
                    <Form.Control.Feedback type='invalid'>
                        { errors.date_of_birth }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col>
                        <Form.Label>{ 'Height (in)' }</Form.Label>
                        <Form.Control 
                            type='number' 
                            placeholder='Optional Field'
                            onChange={ e => handleFieldChange( 'height', e.target.value ) } 
                            />
                    </Col>
                    <Col>
                        <Form.Label>{ 'Weight (lbs)' }</Form.Label>
                        <Form.Control 
                            type='number' 
                            placeholder='Optional Field'
                            onChange={ e => handleFieldChange( 'weight', e.target.value ) } 
                        />
                    </Col>
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ 'Personal Bio' }</Form.Label>
                    <Form.Control 
                        as='textarea' 
                        placeholder='I like long walks on the beach...'
                        onChange={ e => handleFieldChange( 'bio', e.target.value ) } 
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ 'Profile Picture' }</Form.Label>
                    <Form.Control 
                        type='text' 
                        placeholder='Paste image url'
                        onChange={ e => handleFieldChange( 'image_url', e.target.value ) } 
                        />
                </Form.Group>
            </>
        )
    }
    
    const renderTrainerForm = () => {
        return (
            <>
                <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control 
                        type='date'
                        onChange={ e => handleFieldChange( 'date_of_birth', e.target.value ) }
                        isInvalid={ !!errors.date_of_birth }
                    />
                    <Form.Control.Feedback type='invalid'>
                        { errors.date_of_birth }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col sm={4}>
                        <Form.Label>Certification</Form.Label>
                        <Form.Control 
                            as="select" 
                            onChange={ e => handleFieldChange( 'credentials', e.target.value ) } 
                            isInvalid={ !!errors.credentials }
                            custom>
                                <option value={null}>choose one:</option>
                                <option value='ACE'>ACE</option>
                                <option value='ACSM'>ACSM</option>
                                <option value='AFAA'>AFAA</option>
                                <option value='FM'>FM</option>
                                <option value='ISSA'>ISSA</option>
                                <option value='NCCPT'>NCCPT</option>
                                <option value='NCSF'>NCSF</option>
                                <option value='NESTA'>NESTA</option>
                                <option value='NFPT'>NFPT</option>
                                <option value='NSCA'>NSCA</option>
                        </Form.Control>
                        <Form.Control.Feedback type='invalid'>
                            { errors.credentials }
                        </Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Label>Specialty</Form.Label>
                        <Form.Control 
                            type='text' 
                            placeholder='Weight-training'
                            onChange={ e => handleFieldChange( 'specialty', e.target.value ) } 
                            isInvalid={ !!errors.specialty }
                        />
                        <Form.Control.Feedback type='invalid'>
                            { errors.specialty }
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ 'Personal Bio' }</Form.Label>
                    <Form.Control 
                        as='textarea' 
                        placeholder='I like long walks on the beach...'
                        onChange={ e => handleFieldChange( 'bio', e.target.value ) } 
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ 'Profile Picture' }</Form.Label>
                    <Form.Control 
                        type='text' 
                        placeholder='Paste image url'
                        onChange={ e => handleFieldChange( 'image_url', e.target.value ) } 
                        />
                </Form.Group>
            </>
        )
    }

    return (
        <Form id='signup-box' className='shadow d-flex flex-column align-items-stretch justify-content-center'>
            <Form.Group>
                <Form.Control 
                    type="text" 
                    placeholder='Username' 
                    onChange={ e => handleFieldChange( 'name', e.target.value ) }
                    isInvalid={ !!errors.name }
                />
                <Form.Control.Feedback type='invalid'>
                    { errors.name }
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Control 
                    type="password" 
                    placeholder='Password' 
                    onChange={ e => handleFieldChange( 'password', e.target.value ) }
                    isInvalid={ !!errors.password }
                />
                <Form.Control.Feedback type='invalid'>
                    { errors.password }
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Control 
                    type="password" 
                    placeholder='Confirm Password' 
                    onChange={ e => handleFieldChange( 'password_confirmation', e.target.value ) }
                    isInvalid={ !!errors.password_confirmation }
                />
                <Form.Control.Feedback type='invalid'>
                    { errors.password_confirmation }
                </Form.Control.Feedback>
            </Form.Group>
            <div className='h-divider' />
            <div className='account-type-buttons d-flex flex-column align-items-stretch'>
                <h4 className='field-header'>Account type</h4>
                <div id='account-type-buttons' className='d-flex justify-content-center'>

                    <Button onClick={ () => handleFieldChange( 'is_trainer', false ) } 
                        disabled={ user.is_trainer === false }
                        variant='secondary'>
                            Client
                        </Button>
                    <div className='v-divider' />
                    <Button onClick={ () => handleFieldChange( 'is_trainer', true ) } 
                        disabled={ user.is_trainer === true }
                        variant='secondary'>
                            Trainer
                        </Button>
                </div>
            </div>
            { user.is_trainer === false ? renderClientForm() : null }
            { user.is_trainer === true ? renderTrainerForm() : null }
            <div className='d-flex'>
                <Button onClick={ handleGoBack } variant='secondary'>Go Back</Button>
                <Button className='signup-button font-weight-bold' 
                    variant='primary'
                    disabled={ user.is_trainer === null }
                    onClick={ handleSignupSubmit }>Create Account</Button>
            </div>  
        </Form>
    );
}

export default SignupForm;
