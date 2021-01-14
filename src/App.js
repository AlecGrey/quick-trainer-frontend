import './App.css';
import React, { useState } from 'react';

function App() {

  const [ name, setName ] = useState('')
  const [ pass, setPass ] = useState('')

  const handleNameChange = event => {
    setName( event.target.value )
  }

  const handlePassChange = event => {
    setPass( event.target.value )
  }

  const handleFormSubmit = event => {
    event.preventDefault()
    loginUser()
  }

  const loginUser = () => {
    // do a fetch!
  }

  return (
    <div className="App">
      <form>
        <p>name</p>
        <input type='text' onChange={ handleNameChange }/><br/>
        <p>password</p>
        <input type='password' onChange={ handlePassChange }/><br/>
        <p>submit</p>
        <input type='submit' onClick={ handleFormSubmit }/>
      </form>
    </div>
  );
}

export default App;
