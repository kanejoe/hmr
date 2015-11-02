import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import users from './users';
import requisitions from './reqs';
import data from './data';

const rootReducer = combineReducers({
  requisitions,
  users,
  data,
  router: routerStateReducer
});

export default rootReducer;
