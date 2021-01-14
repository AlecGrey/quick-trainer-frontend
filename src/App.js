import './App.css';
// import TestForm from './components/TestForm';
import Container from 'react-bootstrap/Container'
import LoginForm from './components/LoginForm';
import MainLogo from './components/MainLogo';

function App() {

  return (
    <Container className="App d-flex flex-column align-items-center">
      <MainLogo />
      <LoginForm />
    </Container>
  );
}

export default App;
