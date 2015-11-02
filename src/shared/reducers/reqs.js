import Immutable from 'immutable';
const { Map, List, fromJS, OrderedMap } = Immutable;

import {
  VALIDATE_FORM,
  SELECTED_REQ_IN_FORM,
  SUBMIT_FORM,
  FORM_ERRORS,
  SERVER_ERRORS,
  END_SPINNER,
  DELETE_REQ,
  DELETE_REQ_REQUEST,
  ADD_REQ,
  UPDATE_REQ,
  VisibilityFilters
} from '../actions/reqsActions';

import {
  SELECTED_QUERY_HEADER_REQ_IN_FORM,
  CLOSE_REQ_QUERY_HEADER_FORM,
  DND_HEADER_QUERIES,
  RECEIVE_REQ_QUERY_HEADER,
  SERVER_ERRORS_QUERY_HEADER,
} from '../actions/reqsQHeaderActions'

const { SHOW_HIDE_NEW_FORM } = VisibilityFilters;
const DEFAULTSTATE = {
  selectedReq: {
    _id: null,
    title: null
  },
  deleteSpinner: false
}


export default function requisitions(state = {}, action = {}) {
  switch (action.type) {

    case DND_HEADER_QUERIES:
     console.dir(action)
     console.dir(state)
     /*
     cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
      */
     return state;

    case RECEIVE_REQ_QUERY_HEADER:
      console.dir(action.currentReq)
      let mapReqs = Map( state.reqs.map(r => [r._id, Map(r)] ));
      //let map1 = mapReqs.update(action.currentReq._id, action.currentReq => action.currentReq) // there is an error here
      //let obj1 = map1.toJS()
      //let ar1r = Object.keys(obj1).map((k) => obj1[k])
      //console.dir(ar1r)

      return Object.assign({}, state, {
        ...state,
        //reqs: ar1r
      });

      /*const immutableReq = fromJS( state.reqs );  // what about reviver here?

      const map = Immutable.Map(immutableReq.reduce(function(previous, current) {
        previous[ current._id ] = current;
        return previous;
      }, {}));
      //console.dir(Immutable.Map.isMap(immutableReq))
      console.dir(Immutable.Map.isMap(map))
      //console.dir(Immutable.List.isList(immutableReq))
      console.dir(map.size)
      console.dir(map.toArray())*/


    case SELECTED_QUERY_HEADER_REQ_IN_FORM:
      var s =  Object.assign({}, state, {
        ...state,
        queryHeaderFormVisiblility: action.headerQueryFormVisible
      });
      return s;

    case CLOSE_REQ_QUERY_HEADER_FORM:
      return Object.assign({}, state, {
        ...state,
        queryHeaderFormVisiblility: action.headerQueryFormVisible.showForm
      });

    case SHOW_HIDE_NEW_FORM: // check below that this respects non-mutation of state
      var obj = Object.assign({}, state, {
        ...state,
        newFormVisibility: action.visible,
        selectedReq: DEFAULTSTATE.selectedReq,
        disableButton: action.disableButton,
        serverError: null,
      });
      return obj;

    case SELECTED_REQ_IN_FORM:
      let getReq = (e, index, array) => (e._id === action._id);
      return Object.assign({}, state, {
        ...state,
        newFormVisibility: action.visible,
        selectedReq: state.reqs.find( getReq ),
        disableButton: action.disableButton,
        serverError: {}
      });

    case ADD_REQ:
      return Object.assign({}, state, {
        ...state,
        reqs: [...state.reqs, action.req].sort(sorting)
      });

    case UPDATE_REQ:
      let arr = state.reqs.filter( r => (r._id !== action.req._id)); // filter out the old one
      return Object.assign({}, state, {
        ...state,
        reqs: [...arr, action.req].sort(sorting)
      });

    case DELETE_REQ:
      return Object.assign({}, state, {
        ...state,
        reqs: state.reqs.filter( r => r._id !== action._id ),
        deleteSpinner: null
      });

    case DELETE_REQ_REQUEST:
      return Object.assign({}, state, {
        ...state,
        deleteSpinner: { _id: action._id }
      });

    case SUBMIT_FORM:
      return Object.assign({}, state, {
        ...state,
        disableButton: action.disableButton,
        selectedReq: action.formData
      });

    case FORM_ERRORS:
      return Object.assign({}, state, {
        ...state,
        formWarnings: {
          errorStatus: action.response.status,
          errorText: action.response.statusText
        },
        disableButton: false
      });

    case SERVER_ERRORS, SERVER_ERRORS_QUERY_HEADER:
      console.dir(action)
      return Object.assign({}, state, {
        ...state,
        serverError: action.error
      });

    case END_SPINNER:
      return Object.assign({}, state, {
        ...state,
        disableButton: false
      });

    default:
      return state;
  }
}

/*  Note that each of these reducers is managing its own part of the global state.
    The state parameter is different for every reducer,
    and corresponds to the part of the state it manages.
*/

var sorting = (a, b) => {
  var nameA=a.title.toLowerCase(), nameB=b.title.toLowerCase();
  if (nameA < nameB) //sort string ascending
    return -1;
  if (nameA > nameB)
    return 1;
  return 0; //default return value (no sorting)
}
