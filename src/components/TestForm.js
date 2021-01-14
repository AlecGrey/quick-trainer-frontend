import React, { useState } from 'react';

const TestForm = () => {

    const [ name, setName ] = useState('')
    const [ pass, setPass ] = useState('')
    const [ confirmPass, setConfirmPass ] = useState('')
  
    const handleNameChange = event => {
      setName( event.target.value )
    }
  
    const handlePassChange = event => {
      setPass( event.target.value )
    }
  
    const handleConfirmPassChange = event => {
      setConfirmPass( event.target.value )
    }
  
    const handleFormSubmit = event => {
      event.preventDefault()
      loginUser()
    }
  
    const loginParams = () => {
      return {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          password: pass,
          password_confirmation: confirmPass,
          is_trainer: false,
          date_of_birth: '1990-1-1',
          bio: 'BOOOYEAAAH'
        })
      }
    }
  
    const loginUser = () => {
      const url = 'http://localhost:5000/signup'
      const params = loginParams()
      fetch(url, params)
        .then(resp => resp.json())
        .then(console.log)
    }

    return (
        <form>
        <p>name</p>
        <input type='text' onChange={ handleNameChange }/><br/>
        <p>password</p>
        <input type='password' onChange={ handlePassChange }/><br/>
        <p>confirm password</p>
        <input type='password' onChange={ handleConfirmPassChange }/><br/>
        <p>submit</p>
        <input type='submit' onClick={ handleFormSubmit }/>
      </form>
    );
}

export default TestForm;
