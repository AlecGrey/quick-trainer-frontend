import './App.css';
import Container from 'react-bootstrap/Container'
import LoginPage from './containers/LoginPage';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Container className="App d-flex flex-column align-items-center">
        <Route exact path='/' component={ LoginPage } />
      </Container>
    </Router>
  );
}

export default App;
