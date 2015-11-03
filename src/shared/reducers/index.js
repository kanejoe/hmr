import { combineReducers } from 'redux';
import users from './users';
import requisitions from './reqs';
import data from './data';

const rootReducer = combineReducers({
  requisitions,
  users,
  data
});

export default rootReducer;
