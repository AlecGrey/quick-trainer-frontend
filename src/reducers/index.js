import { combineReducers } from 'redux';
import user from './user';
import agreements from './agreements';


export default combineReducers({
    // add reducers
    user,
    agreements
});