import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { loginUser } from '../actions/user';
import { connect } from 'react-redux';

const LoginForm = ({ loginUser }) => {

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
        fetchUser()
    }

    // FETCH REQUEST TO LOGIN USER
    const fetchUser = () => {
        const url = 'http://localhost:5000/login'
        const params = loginParams()
        fetch(url, params)
          .then(resp => resp.json())
          .then(sendUserToStore)
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

      const sendUserToStore = (json) => {
          const user = json.user.data.attributes
          const userPayload = {
              token: json.token,
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
          loginUser( userPayload )
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

const mapDispatchToProps = dispatch => {
    return {
        loginUser: ( userObject ) => dispatch(loginUser(userObject))
    }
}

export default connect(null, mapDispatchToProps)(LoginForm);
