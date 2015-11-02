// import request from 'axios';
import 'babel-core/polyfill'; // so I can use Promises
import fetch from 'isomorphic-fetch'; // so I can use fetch()
import * as api from '../api/index';


/*
 * action types
 */

export const ADD_TODO = 'ADD_TODO';
export const DELETE_USER = 'DELETE_USER';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * other constants
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action creators
 */

export function addTodo(text) {
  return {
    type: ADD_TODO,
    text,
    date: Date.now()
  };
}

export function deleteUser( id ) {
  return {
    type: DELETE_USER,
    promise: fetch(api.user(id), { method: 'PUT' }), // need to figure out how 'promise' works here.
    id
  };
}

export function deleteUser( id ) {
  // we return a thunk function, not an action object!
  return function(dispatch) {
    dispatch( deleteUserPostAsync( id ) );

      fetch(api.user(id), {
        method: 'PUT'
      }).then(resp => {
        console.dir(resp)
        if (resp.status >= 400) {
          throw new Error("Bad response from server");
        }
      }).catch(err => {
        console.dir(err)
      });

    return null;
  }
}

export function doSomething( id ) {  // https://github.com/rackt/redux/issues/723#issuecomment-139927639
  return dispatch => {
    //console.dir(dispatch) // perhaps start the spinner here?
    fetch(
      api.user(id), { method: 'PUT' }
    )
    //.then(res => consume(res.body.getReader()))
    .then(
      resp => {
        //console.dir(resp.body.getReader())
        //console.dir(resp.json())  // that reads the whole stream as JSON -- it is part of the spec // this actually returns a promise
        if (resp.status >= 400) {
          throw new Error("Bad response from server");
        }
    }
    ).then(
      json => dispatch({ type: DELETE_USER, json, id }),
      error => dispatch({ type: SET_VISIBILITY_FILTER, error })
    );
  }
}


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    console.dir(response.status)
    return response
  } else {
    console.dir(response)
    var error = new Error(response.statusText)
    error.response = response;
    //console.dir(error)
    throw error
  }
}

// https://github.com/yutakahirano/fetch-with-streams/
function consume(reader, total = 0) {
  return reader.read().then(({done, value}) => {
    if (done) {
      return
    }
    total += value.byteLength
    console.log("received " + value.byteLength + " bytes (" + total + " bytes in total).")
    return consume(reader, total)
  })
}
