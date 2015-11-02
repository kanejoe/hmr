import fetch from 'isomorphic-fetch';
import { reqsAPI } from '../api/index';

export const SUBMIT_FORM = 'SUBMIT_FORM';
export const VALIDATE_FORM = 'VALIDATE_FORM';
export const SELECTED_REQ_IN_FORM = 'SELECTED_REQ_IN_FORM';
export const FORM_ERRORS = 'FORM_ERRORS';
export const SERVER_ERRORS = 'SERVER_ERRORS';
export const END_SPINNER = 'END_SPINNER';
export const DELETE_REQ = 'DELETE_REQ';
export const DELETE_REQ_REQUEST = 'DELETE_REQ_REQUEST';
export const ADD_REQ = 'ADD_REQ';
export const UPDATE_REQ = 'UPDATE_REQ';
export const VisibilityFilters = {
  SHOW_HIDE_NEW_FORM: 'SHOW_HIDE_NEW_FORM',
};

// operates as a boolean to show new form button or empty form
export function showNewForm( status=false ) {
  return {
    type: VisibilityFilters.SHOW_HIDE_NEW_FORM,
    visible: status,
    disableButton: false
  }
}

export function editReqInForm( _id ) {
  return {
    type: SELECTED_REQ_IN_FORM,
    _id,
    visible: true,
    disableButton: false
  };
}

export function deleteReq( _id ) {
  triggerRemoval( _id );
  return (dispatch) => {
    async () => {
      try {
        const response = await fetch(reqsAPI( _id ), { method : 'DELETE' });
        if (response.status !== 200)
          dispatch( serverErrors(json.error) )
        else if (response.status === 200)
          dispatch( confirmRemoval( _id ) )
      } catch (err) {
        console.warn(err)
      }
    }();
  }
}

function addReq( req ) {
  return {
    type: ADD_REQ,
    req
  };
}

function editReq( req ) {
  return {
    type: UPDATE_REQ,
    req
  };
}

function triggerRemoval( _id ) {
  return {
    type: DELETE_REQ_REQUEST,
    _id
  }
}

function confirmRemoval( _id ) {
  return {
    type: DELETE_REQ,
    _id
  }
}

// to deal with JOI validation errors
function serverErrors( error ) {
  return {
    type: SERVER_ERRORS,
    error
  }
}

function endSpinner() {
  return {
    type: END_SPINNER
  }
}

export function submitForm( formData ) {
  let reqType = (formData._id) ? 'PUT' : 'POST';
  return (dispatch) => {
    dispatch({  // should name this instead
      type: SUBMIT_FORM,
      formData,
      disableButton: true
    });

    async () => {
      const id = (formData && formData._id) ? formData._id : '';
      try {
        const response = await fetch(reqsAPI( id ), { method : reqType, body: JSON.stringify( formData ), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }});
        const json = await response.json();

        if (response.status !== 200)
          dispatch( serverErrors(json.error) )
        else {
          if (!id) dispatch( addReq( json ) ); else dispatch( editReq( json ) );
          dispatch( showNewForm() ); // this closes the form
        }

        const j = await dispatch( endSpinner() )
      } catch (err) {
        console.warn(err)
      }
    }();
  }
}

export function validateForm( formData ) {
  return {
    type: VALIDATE_FORM,
    formData
  }
}

// form errors
function formErrors( response ) {
  return {
    type: FORM_ERRORS,
    response
  }
}

// fetch utility functions (from google: https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en)
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    console.dir(response)
    return Promise.reject(new Error(response))
  }
}

function json(response) {
  return response.json()
}
