import React, { Component }           from 'react';
import { Router }                     from 'react-router';
import createBrowserHistory           from 'history/lib/createBrowserHistory';
import ReactDOM, { render }           from 'react-dom';
import { Provider }                   from 'react-redux';
import routes                         from '../shared/sharedRoutes';
import configureStore                 from '../shared/store/configureStore';
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter
} from 'redux-router';
//import Immutable from 'immutable';
//const { Map, fromJS } = Immutable;

import bootstrap from 'bootstrap/dist/css/bootstrap.css'

const initialDOMState = JSON.parse(unescape(window.__INITIAL_STATE__));
console.dir(initialDOMState)
// Transform into Immutable.js collections,
// but leave top level keys untouched for Redux
/*Object
  .keys(initialDOMState.requisitions.reqs)
  .forEach(key => {
    console.dir(key)
    initialState1[key] = fromJS(initialState1[key]);
   });*/

const initialState = {
  requisitions: {
    reqs: initialDOMState.requisitions.reqs,
  },
  //data: Map( initialDOMState.requisitions.reqs.map(r => [r._id, Map(r)] )),
  data: initialDOMState.data,
  users: initialDOMState.users
};
const store = configureStore( initialState );
const history = createBrowserHistory();

var App = {
  start () {
    render(
      <Provider store={store} key="provider">
        <Router history={history} children={routes} />
      </Provider>
      , document.getElementById('react-app')
    );
  }
};

export default App;

if (!module.parent) {  // what does module parent mean or do?
    window.app = App;
    App.start();
    //createDevToolsWindow();
}
