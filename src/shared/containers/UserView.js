import React, { Component } from 'react';
import { deleteUser, doSomething } from '../actions/users';
import Button from '../components/Button';

export default class UserView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { users, dispatch } = this.props;
    return (
      <ul id="user-list" lassName="list-group">
        {  users.map( (user, index) => {
          return (
            <li key={index} className="list-group-item">{user.email} &raquo;&nbsp;
              <Button text="Remove User" onClick={ () => dispatch(doSomething(user._id)) }  />
            </li>
          );
        })
        }
      </ul>
    );
  }
}
