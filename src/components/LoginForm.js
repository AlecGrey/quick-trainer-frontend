import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

const LoginForm = () => {

    // STATE HOOKS
    const [ name, setName ] = useState('')
    const [ password, setPassword ] = useState('')

    // LOGIN EVENT LISTENERS
    const handleNameChange = event => {
        setName(event.target.value)
    }

    const handlePasswordChange = event => {
        setPassword(event.target.value)
    }

    const handleLoginSubmit = event => {
        event.preventDefault()
        loginUser()
    }

    // FETCH REQUEST TO LOGIN USER
    const loginUser = () => {
        const url = 'http://localhost:5000/login'
        const params = loginParams()
        fetch(url, params)
          .then(resp => resp.json())
          .then(console.log)
    }

    // LOGIN HELPER METHODS
    const loginParams = () => {
        return {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            password
          })
        }
      }

    return (
        <Form id='login-box' className='shadow d-flex flex-column align-items-stretch justify-content-center'>
            <Form.Group>
                <Form.Control type="text" placeholder="Username" onChange={ handleNameChange }/>
            </Form.Group>

            <Form.Group>
                <Form.Control type="password" placeholder="Password" onChange={ handlePasswordChange }/>
            </Form.Group>
            <Button className='login-button font-weight-bold' variant='primary' type='submit' onClick={ handleLoginSubmit }>
                Login
            </Button>
            <div className='divider'/>
            <Button className='signup-button font-weight-bold' variant='secondary'>
                Signup
            </Button>            
        </Form>
    );
}

export default LoginForm;
