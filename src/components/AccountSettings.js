import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { updateUser } from '../actions/user';
import { connect } from 'react-redux';
import ErrorModal from './ErrorModal';
import SuccessModal from './SuccessModal';
import { useHistory } from "react-router-dom";

const AccountSettings = ({ user, updateUser}) => {

    const [ passwordEditable, setPasswordEditable ] = useState(false)
    const [ canDeleteAccount, setCanDeleteAccount ] = useState(false)
    const [ error, setError ] = useState(null)
    const [ successMessage, setSuccessMessage ] = useState(null)
    const history = useHistory()

    const requestSettingChange = (title, content) => {
        // Sends patch request to server!
        const url = 'http://localhost:5000/update-user'
        const params = updateUserParams({title, content})
        fetch( url, params )
            .then(resp => resp.json())
            .then(sendUserUpdatesToStore)
    }

    const sendUserUpdatesToStore = json => {
        const user = json.user.data.attributes
        const userPayload = {
            name: user.name,
            isTrainer: user.account_type === 'trainer',
            specialty: user.specialty,
            credentials: user.credentials,
            dateOfBirth: user.date_of_birth,
            height: user.height,
            weight: user.weight,
            bio: user.bio,
            imageUrl: user.image_url
        }
        updateUser(userPayload)
    }

    const updateUserParams = ({title, content}) => {
        const field = fieldDictionary[title]
        return {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : `Bearer ${ localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                [field]: content
            })
        }
    }

    const updatePasswordParams = password => {
        return {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : `Bearer ${ localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                'password': password,
                'password_confirmation': password
            })
        }
    }

    const deleteUserParams = password => {
        return {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : `Bearer ${ localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                'password': password
            })
        }
    }

    const fieldDictionary = {
        'Name': 'name',
        'Specialty': 'specialty',
        'Credentials': 'credentials',
        'Date of Birth': 'date_of_birth',
        'Height': 'height',
        'Weight': 'weight',
        'Bio': 'bio',
        'Image Link': 'image_url'
    }

    const handlePasswordEvent = ({ eventType, password }) => {
        // 'CHANGE_PASSWORD' or 'DELETE_ACCOUNT'
        let url, params
        if ( eventType === 'CHANGE_PASSWORD' ) {
            url = 'http://localhost:5000/update-user'
            params = updatePasswordParams( password )
        } else if ( eventType === 'DELETE_ACCOUNT' ) {
            url = 'http://localhost:5000/delete-user'
            params = deleteUserParams( password )
        }
        fetch(url, params)
            .then(resp => resp.json())
            .then(json => {
                handlePasswordEventResponse({json, eventType})
            })
    }

    const handlePasswordEventResponse = ({json, eventType}) => {
        if (json.errors) return setError( 'Invalid password!' )

        if (eventType === 'CHANGE_PASSWORD') {
            setPasswordEditable(false)
            setSuccessMessage('Your password was changed successfully.')
        } else if (eventType === 'DELETE_ACCOUNT') {
            setSuccessMessage('Your account was successfully deleted.  Redirecting to login.')
            setTimeout( () => {
                localStorage.removeItem('token')
                history.push('/')
            }, 3000)
        }
    }

    return (
        <Container id='edit-settings-column' className='flex-grow-1 d-flex flex-column'>
            <SectionTitle title='Account Settings' />
            <EditableSetting 
                contentType='text' 
                title='Name' 
                currentValue={ user.name } 
                requestSettingChange={ requestSettingChange }
            />
            <EditableSetting 
                contentType='text' 
                title='Image Link' 
                currentValue={ user.imageUrl } 
                requestSettingChange={ requestSettingChange }
            />
            <AccountManagementButtons 
                passwordEditable={ passwordEditable }
                setPasswordEditable={ setPasswordEditable }
                canDeleteAccount={ canDeleteAccount }
                setCanDeleteAccount={setCanDeleteAccount}
            />
            <EditPassword
                passwordEditable={ passwordEditable }
                canDeleteAccount={ canDeleteAccount }
                passwordSubmitEvent={ handlePasswordEvent }
                setError={ setError }
            
            />
            <SectionTitle title={ user.isTrainer ? 'Coach Settings' : 'Client Settings' } />
            <EditableSetting
                contentType='date'
                title='Date of Birth'
                currentValue={ user.dateOfBirth }
                requestSettingChange={ requestSettingChange }
            />
            { user.isTrainer ? 
                <EditableSetting 
                    contentType='text' 
                    title='Specialty' 
                    currentValue={ user.specialty } 
                    requestSettingChange={ requestSettingChange }
                /> : null }
            { user.isTrainer ? 
                <EditableSetting 
                    contentType='text' 
                    title='Credentials' 
                    currentValue={ user.credentials } 
                    requestSettingChange={ requestSettingChange }
                /> : null }
            { !user.isTrainer ? 
                <EditableSetting 
                    contentType='number' 
                    title='Height' 
                    currentValue={ user.height } 
                    requestSettingChange={ requestSettingChange }
                /> : null }
            { !user.isTrainer ? 
                <EditableSetting 
                    contentType='number' 
                    title='Weight' 
                    currentValue={ user.weight } 
                    requestSettingChange={ requestSettingChange }
                /> : null }
                <EditableSetting
                contentType='textarea'
                title='Bio'
                currentValue={ user.bio }
                requestSettingChange={ requestSettingChange }
            />
            <ErrorModal errorMessage={ error } resetErrorMessage={ () => setError(null) } />
            <SuccessModal successMessage={ successMessage } resetSuccessMessage={ () => setSuccessMessage(null) } />
        </Container>
    );
}

// LOCAL COMPONENTS
const SectionTitle = ({ title }) => {
    return (
        <>
            <h1 className='display-4 font-italic'>{ title }</h1>
            <div className='section-title-divider'/>
        </>
    )
}

const EditableSetting = ({ contentType, title, currentValue, requestSettingChange }) => {

    const [ content, setContent ] = useState('')
    const [ editable, setEditable ] = useState(false)

    useEffect(() => {
        if (title !== 'Image Link') setContent( currentValue === null ? '' : currentValue )
        else setContent( "Click 'edit' to change your image" )
    }, [title, currentValue])

    const setContentEditable = () => {
        setEditable(true)
        if ( title === 'Image Link' ) setContent('')
    }

    const submitChanges = () => {
        setEditable(false)
        // Height/weight fields can be left blank, other fields must have a value.
        if (title === 'Weight' || title === 'Height' || content !== '') {
            requestSettingChange(title, content)
        }
        else if ( title !== 'Image Link' ) setContent(currentValue)
        else setContent("Click 'edit' to change your image")
    }

    const renderEditableField = () => {
        switch (contentType) {
            case 'textarea':
                return <textarea value={ content } onChange={ handleOnChange } />
            case 'text':
                return <input type='text' value={ content } onChange={ handleOnChange }/>
            case 'number':
                return <input type='number' value={ content } onChange={ handleOnChange }/>
            case 'date':
                return <input type='date' value={ content } onChange={ handleOnChange }/>
            default:
                return <input type='text' value={ content } onChange={ handleOnChange }/>
        }
    }

    const handleOnChange = event => {
        setContent(event.target.value)
    }

    const renderCurrentContent = () => {
        if ( title === 'Bio' ) return <p className='bio-content'>{ content }</p>
        if ( title === 'Image Link' ) return <p className='img-content'>{ content }</p>
        if ( (title === 'Weight' || title === 'Height') && content === '' ) {
            return <p className='no-content-entered'>No value entered</p>
        }
        return <p>{ content }</p>
    }

    return (
        <div className='d-flex editable-setting'>
            <h3>{ title }:</h3>
            { editable ? renderEditableField() : renderCurrentContent() }
            { 
                editable ? 
                    <p className='edit-field' onClick={ submitChanges }>Done</p> : 
                    <p className='edit-field' onClick={ setContentEditable }>Edit</p> 
            }
        </div>
    )
}

const AccountManagementButtons = ({ passwordEditable, setPasswordEditable, canDeleteAccount, setCanDeleteAccount }) => {

    const handlePasswordButtonClick = event => setPasswordEditable(!passwordEditable)
    const handleDeleteAccountButtonClick = event => setCanDeleteAccount(!canDeleteAccount)

    return (
        <div className='account-button-container d-flex justify-content-start'>
            <Button variant='light' onClick={ handlePasswordButtonClick } disabled={ canDeleteAccount }>
                { passwordEditable ? 'Cancel' : 'Change Password' }
            </Button>
            <Button variant='danger' onClick={ handleDeleteAccountButtonClick } disabled={ passwordEditable }>
                { canDeleteAccount ? 'Cancel' : 'Delete Account' }
            </Button>
        </div>
    )
}

const EditPassword = ({ passwordEditable, canDeleteAccount, passwordSubmitEvent, setError }) => {

    const [ password, setPassword ] = useState('')
    const [ passwordConfirmation, setPasswordConfirmation ] = useState('')

    useEffect(() => {
        setPassword('')
        setPasswordConfirmation('')
    }, [ passwordEditable, canDeleteAccount ])

    const handlePasswordChange = e => setPassword( e.target.value )
    const handlePasswordConfirmationChange = e => setPasswordConfirmation( e.target.value )

    const handleOnClick = event => {
        if (password !== passwordConfirmation) {
            setError('Passwords do not match!')
            setPassword('')
            setPasswordConfirmation('')
            return
        }
        // FIRE UPSTREAM EVENT LISTENER
        let eventType
        if ( passwordEditable ) eventType = 'CHANGE_PASSWORD'
        else if ( canDeleteAccount ) eventType = 'DELETE_ACCOUNT'

        return passwordSubmitEvent({ eventType, password })
    }

    const conditionallyRenderComponent = () => {
        if ( passwordEditable || canDeleteAccount ) {
            return (
                <div className='d-flex flex-column'>
                    <div className='d-flex enter-password-container'>
                        <label>Password: </label>
                        <input type='password' value={ password } onChange={ handlePasswordChange } />
                        <label>Confirm Password: </label>
                        <input type='password' value={ passwordConfirmation } onChange={ handlePasswordConfirmationChange } />
                    </div>
                    <div className='d-flex'>
                        { conditionallyRenderButton() }
                        { canDeleteAccount ? <p className='password-warning'>Confirm password to delete account</p> : null}
                    </div>
                </div>
                
            )
        } else return null
    }

    const conditionallyRenderButton = () => {
        if ( passwordEditable ) {
            return <Button variant='primary' className='password-button align-self-start' onClick={ handleOnClick }>Change Password</Button>
        } else if ( canDeleteAccount ) {
            return <Button variant='danger' className='password-button align-self-start' onClick={ handleOnClick }>Delete Account</Button>
        }
    }

    return (
        <>
            { conditionallyRenderComponent() }
        </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => dispatch(updateUser(user))
    }
}

export default connect(null, mapDispatchToProps)(AccountSettings);
