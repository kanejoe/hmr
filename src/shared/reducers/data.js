import Immutable from 'immutable';
const { Map, List, fromJS, OrderedMap } = Immutable;

import {
  TEST,
} from '../actions/reqsQHeaderActions';


export default function requisitions(state = {}, action = {}) {
  switch (action.type) {

    case TEST:
      //let {currentReq} = action;
      //console.dir(currentReq)
      //let one = state.imm.get(currentReq._id)
      //console.dir(one.toJS())
      //console.dir(state.imm)
      console.dir(state)
      return state;

    default:
      return state;
  }
}
