import { combineReducers } from 'redux';
import { authReducer } from './auth';

const rootReducer = combineReducers({
    user: authReducer,
    // post: postReducer
  });


export default rootReducer;