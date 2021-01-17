import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { updateUser } from '../actions/user';
import { connect } from 'react-redux';

const AccountSettings = ({ user, updateUser}) => {

    const [ passwordEditable, setPasswordEditable ] = useState(false)
    const [ canDeleteAccount, setCanDeleteAccount ] = useState(false)

    const requestSettingChange = (title, content) => {
        // Sends patch request to server!
        const url = 'http://localhost:5000/update-user'
        const params = updateUserParams(title, content)
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

    const updateUserParams = (title, content) => {
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

    return (
        <Container id='edit-settings-column' className='flex-grow d-flex flex-column'>
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
            
            />

            <SectionTitle title={ user.isTrainer ? 'Coach Settings' : 'Client Settings' } />
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
        if (title !== 'Image Link') setContent( currentValue )
    }, [title, currentValue])

    const setContentEditable = () => {
        setEditable(true)
    }

    const submitChanges = () => {
        setEditable(false)
        // add upstream handling to edit user
        if (content !== '') requestSettingChange(title, content)
        else if ( title !== 'Image Link' ) setContent(currentValue)
        else setContent('')
        
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
            <Button variant='secondary' onClick={ handlePasswordButtonClick } disabled={ canDeleteAccount }>
                { passwordEditable ? 'Cancel' : 'Change Password' }
            </Button>
            <Button variant='danger' onClick={ handleDeleteAccountButtonClick } disabled={ passwordEditable }>
                { canDeleteAccount ? 'Cancel' : 'Delete Account' }
            </Button>
        </div>
    )
}

const EditPassword = ({ passwordEditable, canDeleteAccount }) => {

    const [ password, setPassword ] = useState('')
    const [ passwordConfirmation, setPasswordConfirmation ] = useState('')

    const handlePasswordChange = e => setPassword( e.target.value )
    const handlePasswordConfirmationChange = e => setPasswordConfirmation( e.target.value )

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
                    { conditionallyRenderButton() }
                    { canDeleteAccount ? <p><em>This action cannot be undone!</em></p> : null}
                </div>
                
            )
        } else return null
    }

    const conditionallyRenderButton = () => {
        if ( passwordEditable ) {
            return <Button variant='secondary' className='password-button align-self-start'>Change Password</Button>
        } else if ( canDeleteAccount ) {
            return <Button variant='danger' className='password-button align-self-start'>Delete Account</Button>
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
