import { ADD_TODO, DELETE_USER, EDIT_USER, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED } from '../constants/ActionTypes';

export default function userReducer(state = {}, action) {  // this has a signature
  switch (action.type) {
  case ADD_TODO:
    return [{
      id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
      completed: false,
      text: action.text
    }, ...state];

  case DELETE_USER:
    //console.dir(action);
    //console.dir(state)
    return state.filter(user =>
      user._id !== action.id
    );

  case EDIT_USER:
    return state.map(user =>
      user._id === action._id ?
        Object.assign({}, user, { email: action.email }) :
        user
    );

  case COMPLETE_TODO:
    return state.map(todo =>
      todo.id === action.id ?
        Object.assign({}, todo, { completed: !todo.completed }) :
        todo
    );

  case COMPLETE_ALL:
    const areAllMarked = state.every(todo => todo.completed);
    return state.map(todo => Object.assign({}, todo, {
      completed: !areAllMarked
    }));

  case CLEAR_COMPLETED:
    return state.filter(todo => todo.completed === false);

  default:
    return state;
  }
}
