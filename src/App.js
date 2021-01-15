import './App.css';
// import TestForm from './components/TestForm';
import Container from 'react-bootstrap/Container'
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Container className="App d-flex flex-column align-items-center">
        <Route exact path='/' component={ LoginForm } />
      </Container>
    </Router>
  );
}

export default App;
