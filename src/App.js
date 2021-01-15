import './App.css';
import Container from 'react-bootstrap/Container'
import LoginPage from './containers/LoginPage';
import HomePage from './containers/HomePage';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Container className="App d-flex flex-column align-items-center">
        <Route exact path='/' component={ LoginPage } />
        <Route exact path='/home' component={ HomePage } />
      </Container>
    </Router>
  );
}

export default App;
