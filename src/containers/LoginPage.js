import React, { useState, useEffect } from 'react';
// BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
// DEPENDENT COMPONENTS
import MainLogo from '../components/MainLogo';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import ErrorModal from '../components/ErrorModal';
// REDUX ACTIONS AND CONNECT
import { loginUser } from '../actions/user';
import { addAgreements } from '../actions/agreements';
import { connect } from 'react-redux';
// REACT ROUTER
import { useHistory } from "react-router-dom";

const LoginPage = ({ loginUser, addAgreements }) => {

    // STATE HOOKS
    const [ name, setName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ error, setError ] = useState(null)
    const [ showSignup, setShowSignup ] = useState(false)  

    // USE HISTORY HOOK
    const history = useHistory()
    
    useEffect(()=>{
        if (!!localStorage.token) history.push('/home')
    },[])

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
        console.log('initiating login fetch')
        const url = 'http://localhost:5000/login'
        const params = loginParams()
        fetch(url, params)
          .then(resp => resp.json())
          .then(handleUserFetch)
          .then(navigateToHomePage)
    }

    const handleUserFetch = json => {
        // if we receive errors back instead of a user, render an error message, otherwise update the store
        !!json.error ? setError(json.error) : sendUserToStore(json)
        // return status of login
        return !json.error
    }

    // REROUTING AFTER LOGIN
    const navigateToHomePage = loginSuccessful => {
        if ( loginSuccessful ) history.push('/home')
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
        // Handles all saving of user data in store & in local storage
        localStorage.setItem('token', json.token)
        const user = json.user.data.attributes
        const agreements = formatAgreementsFromJson(json)
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
        loginUser( userPayload )
        addAgreements( agreements )
    }

    const formatAgreementsFromJson = json => {
        return json.user.data.attributes.agreements.map( agreement => {
            return {
                ...agreement.data.attributes,
                id: parseInt(agreement.data.id)
            }
        })
    }

    return (
        <Container id='login-page' className='d-flex align-items-center flex-column'>
            <MainLogo />
            {/* CONDITIONALLY RENDER ONE OF TWO FORMS */}
            { showSignup ? 
                <SignupForm
                    setShowSignup={ setShowSignup }
                    handleUserFetch={ handleUserFetch }
                    navigateToHomePage={ navigateToHomePage }
                /> : <LoginForm 
                    changeName={ handleNameChange } 
                    changePassword={ handlePasswordChange }
                    handleLoginSubmit={ handleLoginSubmit }
                    setShowSignup={ setShowSignup }
                /> }
            
            <ErrorModal errorMessage={ error } resetErrorMessage={ () => setError(null) } />
        </Container>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        loginUser: ( userObject ) => dispatch(loginUser(userObject)),
        addAgreements: ( clients ) => dispatch(addAgreements(clients))
    }
}

export default connect(null, mapDispatchToProps)(LoginPage);
