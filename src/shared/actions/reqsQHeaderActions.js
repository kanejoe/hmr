import fetch from 'isomorphic-fetch';
import { reqsQueryHeaders } from '../api/index';

export const SUBMIT_QUERY_HEADER_FORM = 'reqQueryHeader/SUBMIT_QUERY_HEADER_FORM';
export const SELECTED_QUERY_HEADER_REQ_IN_FORM = 'reqQueryHeader/SELECTED_REQ_IN_FORM';
export const CLOSE_REQ_QUERY_HEADER_FORM = 'reqQueryHeader/CLOSE_REQ_QUERY_HEADER_FORM';
export const DND_HEADER_QUERIES = 'reqQueryHeader/DND_HEADER_QUERIES';
export const RECEIVE_REQ_QUERY_HEADER = 'reqQueryHeader/RECEIVE_REQ_QUERY_HEADER';
export const FORM_ERRORS = 'FORM_ERRORS';
export const SERVER_ERRORS_QUERY_HEADER = 'reqQueryHeader/SERVER_ERRORS_QUERY_HEADER';
export const TEST = 'reqQueryHeader/TEST';
export const VALIDATE_FORM = 'VALIDATE_FORM';

// closes the form
export function closeReqQueryHeaderInForm() {
  return {
    type: CLOSE_REQ_QUERY_HEADER_FORM,
    headerQueryFormVisible: {
      showForm: false
    },
  };
}

// shows the form with the particular req header supplied
export function editReqQueryHeaderInForm( queryHeader ) {
  return {
    type: SELECTED_QUERY_HEADER_REQ_IN_FORM,
    headerQueryFormVisible: {
      showForm: true,
      queryHeader
    },
  };
}

export function dndQueryHeaders( query, dragIndex, dropIndex ) {
  return {
    type: DND_HEADER_QUERIES,
    dnd: {
      query,
      dragIndex,
      dropIndex
    }
  }
}

export function testReqQueryHeaderInForm( currentReq ) {
  return {
    type: TEST,
    currentReq
  }
}

export function submitForm( formData, currentReqId ) {
  const reqType = (formData._id) ? 'PUT' : 'POST';
  const id = (formData && formData._id) ? formData._id : '';

  return (dispatch) => {
    async () => {
      try {
        const response = await fetch( reqsQueryHeaders( currentReqId, id ), {
          method : reqType,
          body: JSON.stringify( formData ),
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        const json = await response.json();

        if (response.status !== 200) dispatch( serverErrors(json.error) )
        else dispatch( receiveReqHeader( currentReqId, json ) );
      } catch (err) {
        console.warn(err)
      }
    }();
  }
}

function receiveReqHeader(reqId, req) {
  return {
    type: RECEIVE_REQ_QUERY_HEADER,
    req,
    //queries: req.queries.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

// to deal with JOI validation errors
function serverErrors( error ) {
  return {
    type: SERVER_ERRORS_QUERY_HEADER,
    error
  }
}


/*export function deleteReq( _id ) {
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

function endSpinner() {
  return {
    type: END_SPINNER
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
}*/

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
