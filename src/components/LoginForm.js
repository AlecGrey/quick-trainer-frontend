import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

const LoginForm = ({ changeName, changePassword, handleLoginSubmit, setShowSignup, errors, disabledFields }) => {

    const handleSignupClick = e => {
        setShowSignup(true)
    }

    return (
        <Form 
            id='login-box' 
            className='shadow d-flex flex-column align-items-stretch justify-content-center'
            onSubmit={ handleLoginSubmit }
        >
            <Form.Group>
                <Form.Control 
                    type="text" 
                    placeholder="Username" 
                    onChange={ changeName }
                    isInvalid={ !!errors.name }
                    disabled={ disabledFields }
                />
                <Form.Control.Feedback type='invalid'>
                    { errors.name }
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    onChange={ changePassword }
                    isInvalid={ !!errors.password }
                    disabled={ disabledFields }
                />
                <Form.Control.Feedback type='invalid'>
                    { errors.password }
                </Form.Control.Feedback>
            </Form.Group>
            <Button 
                className='login-button font-weight-bold' 
                variant='primary' 
                type='submit' 
                onClick={ handleLoginSubmit }
                disabled={ disabledFields }    
            >Login</Button>
            <div className='h-divider'/>
            <Button 
                className='signup-button' 
                variant='secondary' 
                onClick={ handleSignupClick }
                disabled={ disabledFields }
            >Signup</Button>            
        </Form>
    );
}

export default LoginForm;
