import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
//import { devTools, persistState } from 'redux-devtools';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

let middleware = [thunk];
let createStoreWithMiddleware;

createStoreWithMiddleware = compose(
  applyMiddleware(...middleware),
  //reduxReactRouter({ createBrowserHistory }),
  //devTools()
  // persistState
)(createStore);


export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
