import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
// REACT-REDUX AND ACTIONS
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers/index';
// ACTION CABLE
// import actionCable from 'actioncable';

// initializing redux store & devtools
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// initializing action cable connection
// const CableApp = {}
// CableApp.cable = actionCable.createConsumer('ws://localhost:5000/cable')
// export const ActionCableContext = createContext()



ReactDOM.render(
  <Provider store={ store }>
    {/* <ActionCableContext.Provider value={ CableApp.cable }> */}
      <App />
    {/* </ActionCableContext.Provider> */}
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
