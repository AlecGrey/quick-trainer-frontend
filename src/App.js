import './App.css';
import React, { useEffect } from 'react';
// IMPORT COMPONENT DEPENDENCIES
import NavBar from './components/NavBar';
// ADD PAGE CONTAINERS FOR UNIQUE ROUTES
import LoginPage from './containers/LoginPage';
import HomePage from './containers/HomePage';
import ManageAccountPage from './containers/ManageAccountPage';
import TrainingAgreementsPage from './containers/TrainingAgreementsPage';
// REDUX AND REDUX ACTIONS
import { connect } from 'react-redux';
import { loginUser } from './actions/user';
import { addAgreements } from './actions/agreements';
// REACT ROUTER
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

function App({ user, loginUser, addAgreements }) {

  useEffect(() => {
    // on page load, compare token to store, fetch the user information if necessary
    if ( localStorage.getItem('token') && user && !user.name) fetchUserToStore()
  },[])

  const fetchUserToStore = () => {
    console.log('Found token, initiating request for user information!')
    // SEND GET REQUEST TO GET USER INFORMATION
    const url = `http://localhost:5000/get-user`
    const params = getUserParams()
    fetch(url, params)
      .then(resp => resp.json())
      .then(sendUserToStore)
  }

  // ON PAGE REFRESH, A USER WILL RE-FETCH THEIR USER INFORMATION VIA
  // THE WEB TOKEN SAVED ON LOCAL STORAGE

  const sendUserToStore = (json) => {
    // Handles all saving of user data in store
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
    // debugger
    return json.user.data.attributes.agreements.map( agreement => {
        return {
            ...agreement.data.attributes,
            id: parseInt(agreement.data.id)
        }
    })
  }

  const getUserParams = () => {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${ localStorage.getItem('token') }`
      }
    }
  }

  return (
    <Router>
      <NavBar />
      <div className="App d-flex flex-column align-items-around">
        <Route exact path='/' component={ LoginPage } />
        <Route exact path='/home' component={ HomePage } />
        <Route exact path='/manage-account' component={ ManageAccountPage } />
        <Route exact path='/training-agreements' component={ TrainingAgreementsPage } />
        { localStorage.getItem('token') ? null : <Redirect to='/' /> }
      </div>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
      loginUser: ( userObject ) => dispatch(loginUser(userObject)),
      addAgreements: ( clients ) => dispatch(addAgreements(clients))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
