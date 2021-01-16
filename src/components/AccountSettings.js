import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

const AccountSettings = ({ user }) => {
    return (
        <Container id='edit-settings-column' className='flex-grow d-flex flex-column'>
            <SectionTitle title='Account Settings' />
            <EditableSetting contentType='text' title='Name' currentValue={ user.name } />
            <EditableSetting contentType='textarea' title='Bio' currentValue={ user.bio } />
            <EditableSetting contentType='date' title='Date' currentValue={ user.dateOfBirth } />
            <EditableSetting contentType='number' title='Weight' currentValue={ 69 } />
            <EditableSetting contentType='text' title='Name' currentValue={ user.name } />

            <SectionTitle title={ user.isTrainer ? 'Coach Settings' : 'Client Settings' } />
        </Container>
    );
}

const SectionTitle = ({ title }) => {
    return (
        <>
            <h1 className='display-4 font-italic'>{ title }</h1>
            <div className='section-title-divider'/>
        </>
    )
}

const EditableSetting = ({ contentType, title, currentValue }) => {

    const [ content, setContent ] = useState('')
    const [ editable, setEditable ] = useState(false)

    useEffect(() => setContent( currentValue ), [currentValue])

    const setContentEditable = () => {
        setEditable(true)
    }

    const submitChanges = () => {
        setEditable(false)
        // add upstream handling to edit user
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

    const handleOnChange = event => setContent(event.target.value)

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

export default AccountSettings;
