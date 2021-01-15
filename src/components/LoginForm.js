import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

const LoginForm = ({ changeName, changePassword, handleLoginSubmit }) => {

    return (
        <Form id='login-box' className='shadow d-flex flex-column align-items-stretch justify-content-center'>
            <Form.Group>
                <Form.Control type="text" placeholder="Username" onChange={ changeName }/>
            </Form.Group>

            <Form.Group>
                <Form.Control type="password" placeholder="Password" onChange={ changePassword }/>
            </Form.Group>
            <Button className='login-button font-weight-bold' variant='primary' type='submit' onClick={ handleLoginSubmit }>
                Login
            </Button>
            <div className='h-divider'/>
            <Button className='signup-button font-weight-bold' variant='secondary'>
                Signup
            </Button>            
        </Form>
    );
}

export default LoginForm;
