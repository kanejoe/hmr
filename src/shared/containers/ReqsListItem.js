import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import moment from 'moment';
import * as reqsActions from '../actions/reqsActions';
import { DragSource, DropTarget } from 'react-dnd';
import * as ItemTypes from '../constants/ItemTypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

@connect(
  state => ({
    requisitions: state.requisitions
  }),
  dispatch => bindActionCreators(reqsActions, dispatch)
)

export default class ReqsListItem extends Component {
  static propTypes = {
    req: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  selectCurrentItem(e) {
    e.preventDefault();
    let { req, editReqInForm } = this.props;
    editReqInForm( req._id );
  }

  deleteCurrentItem(e) {
    e.preventDefault();
    let { req, deleteReq } = this.props;
    deleteReq( req._id );
  }

  render () {
    let { req, key, requisitions: { deleteSpinner } } = this.props;
    let deleteButton;

    if (!deleteSpinner || (deleteSpinner._id !== req._id)) {
      deleteButton = (
        <button type="button"
          className="btn btn-link btn-sm pull-right"
          onClick={::this.deleteCurrentItem}>
            del
        </button>
      );
    } else {
      deleteButton = (
        <span className='pull-right' style={{ marginTop: '6px'}}>
          <i className='fa fa-spinner fa-pulse' style={{ 'color': '#014c8c'}}/>
        </span>
      )
    }
// <Link to={`/${req.title}`}>{req.title}</Link>
    return ((
      <li
        key={key}
        className="list-group-item">
          <Link to={`/message/${req._id}`}>{req.title}</Link>
          {deleteButton}
          <button type="button"
            className="btn btn-link btn-sm pull-right"
            onClick={::this.selectCurrentItem}>
              edit
          </button>
      </li>
    ));
  }
}
