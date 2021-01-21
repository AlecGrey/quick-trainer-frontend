import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SignupForm = ({ setShowSignup, handleUserFetch, navigateToHomePage }) => {
    // SWITCH VIEW BACK TO LOGIN PAGE
    const handleGoBack = e => setShowSignup(false)
    // STATE HOOKS
    const [ username, setUsername ] = useState(null)
    const [ password, setPassword ] = useState(null)
    const [ passwordConfirmation, setPasswordConfirmation ] = useState(null)
    const [ accountType, setAccountType ] = useState(null)
    const [ birthdate, setBirthdate ] = useState(null)
    const [ height, setHeight ] = useState(null)
    const [ weight, setWeight ] = useState(null)
    const [ bio, setBio ] = useState(null)
    const [ image, setImage ] = useState(null)
    const [ credentials, setCredentials ] = useState(null)
    const [ specialty, setSpecialty ] = useState(null)
    // EVENT HANDLERS
    const selectClientType = e => {
        setAccountType('CLIENT')
        resetFieldsOnAccountToggle()
    }
    const selectTrainerType = e => {
        setAccountType('TRAINER')
        resetFieldsOnAccountToggle()
    }
    // EVENTS MANAGING STATE
    const handleUsernameChange = e => setUsername(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value)
    const handleConfirmationChange = e => setPasswordConfirmation(e.target.value)
    const handleBirthdateChange = e => setBirthdate(e.target.value)
    const handleHeightChange = e => setHeight(e.target.value)
    const handleWeightChange = e => setWeight(e.target.value)
    const handleBioChange = e => setBio(e.target.value)
    const handleImageChange = e => setImage(e.target.value)
    const handleCertificationChange = e => setCredentials(e.target.value)
    const handleSpecialtyChange = e => setSpecialty(e.target.value)
    // ON FORM SUBMISSION EVENT
    const handleSignupSubmit = e => {
        // ADD ERROR HANDLING ON FORM SUBMISSION!
        // :O <(WHERE'S THE ERROR HANDLING!?)
        newUserFetch()
    }

    const newUserFetch = () => {
        // This fetch takes advantage of two callback functions from the login page:
        // handleUserFetch and navigateToHomePage
        const url = 'http://localhost:5000/signup'
        const params = newUserParams()
        fetch(url, params)
            .then(resp => resp.json())
            .then(handleUserFetch)
            .then(navigateToHomePage)
    }

    const newUserParams = () => {
        return {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(newFormattedUser())
        }
    }
    
    const newFormattedUser = () => {
        // Set new user based on database schema for strong params
        return {
            name: username,
            password,
            password_confirmation: passwordConfirmation,
            is_trainer: accountType === 'TRAINER',
            date_of_birth: birthdate,
            bio,
            height,
            weight,
            specialty,
            credentials,
            image_url: image
        }
    }


    // HELPER METHODS
    const resetFieldsOnAccountToggle = () => {
        setBirthdate(null)
        setHeight(null)
        setWeight(null)
        setBio(null)
        setImage(null)
        setCredentials(null)
        setSpecialty(null)
    }

    // SUBCOMPONENTS
    const renderClientForm = () => {
        return (
            <>
                <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control 
                        type='date'
                        onChange={ handleBirthdateChange }
                    />
                </Form.Group>
                <Form.Group as={Row}>
                    <Col>
                        <Form.Label>{ 'Height (in)' }</Form.Label>
                        <Form.Control 
                            type='number' 
                            placeholder='Optional Field'
                            onChange={ handleHeightChange } 
                            />
                    </Col>
                    <Col>
                        <Form.Label>{ 'Weight (lbs)' }</Form.Label>
                        <Form.Control 
                            type='number' 
                            placeholder='Optional Field'
                            onChange={ handleWeightChange } 
                        />
                    </Col>
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ 'Personal Bio' }</Form.Label>
                    <Form.Control 
                        as='textarea' 
                        placeholder='I like long walks on the beach...'
                        onChange={ handleBioChange } 
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ 'Profile Picture' }</Form.Label>
                    <Form.Control 
                        type='text' 
                        placeholder='Paste image url'
                        onChange={ handleImageChange } 
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
                        onChange={ handleBirthdateChange }
                    />
                </Form.Group>
                <Form.Group as={Row}>
                    <Col sm={ 4 }>
                        <Form.Label>Certification</Form.Label>
                        <Form.Control as="select" onChange={ handleCertificationChange } custom>
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
                    </Col>
                    <Col>
                        <Form.Label>Specialty</Form.Label>
                        <Form.Control 
                            type='text' 
                            placeholder='Weight-training'
                            onChange={ handleSpecialtyChange } 
                        />
                    </Col>
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ 'Personal Bio' }</Form.Label>
                    <Form.Control 
                        as='textarea' 
                        placeholder='I like long walks on the beach...'
                        onChange={ handleBioChange } 
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ 'Profile Picture' }</Form.Label>
                    <Form.Control 
                        type='text' 
                        placeholder='Paste image url'
                        onChange={ handleImageChange } 
                        />
                </Form.Group>
            </>
        )
    }

    return (
        <Form id='signup-box' className='shadow d-flex flex-column align-items-stretch justify-content-center'>
            <Form.Group>
                <Form.Control type="text" placeholder='Username' onChange={ handleUsernameChange }/>
            </Form.Group>
            <Form.Group>
                <Form.Control type="password" placeholder='Password' onChange={ handlePasswordChange }/>
            </Form.Group>
            <Form.Group>
                <Form.Control type="password" placeholder='Confirm Password' onChange={ handleConfirmationChange }/>
            </Form.Group>
            <div className='h-divider' />
            <div className='account-type-buttons d-flex flex-column align-items-stretch'>
                <h4 className='field-header'>Account type</h4>
                <div id='account-type-buttons' className='d-flex justify-content-center'>

                    <Button onClick={ selectClientType } 
                        disabled={ accountType === 'CLIENT' }
                        variant='secondary'>
                            Client
                        </Button>
                    <div className='v-divider' />
                    <Button onClick={ selectTrainerType } 
                        disabled={ accountType === 'TRAINER' }
                        variant='secondary'>
                            Trainer
                        </Button>
                </div>
            </div>
            { accountType === 'CLIENT' ? renderClientForm() : null }
            { accountType === 'TRAINER' ? renderTrainerForm() : null }
            <div className='d-flex'>
                <Button onClick={ handleGoBack } variant='secondary'>Go Back</Button>
                <Button className='signup-button font-weight-bold' 
                    variant='primary'
                    onClick={ handleSignupSubmit }>Create Account</Button>
            </div>  
        </Form>
    );
}

export default SignupForm;
