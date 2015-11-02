import React, { Component, PropTypes } from 'react';
import * as reqsQHeaderActions from '../actions/reqsQHeaderActions';
import ItemTypes from './dnd/ItemTypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragSource, DropTarget } from 'react-dnd';
import { ListHeaderSource, ListHeaderTarget } from './dnd/';
import ReqsQueryHeaderForm from './ReqsQueryHeaderForm';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  borderRadius: '4px'
};

@DropTarget(ItemTypes.HEADER_LIST_ITEM, ListHeaderTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))

@DragSource(ItemTypes.HEADER_LIST_ITEM, ListHeaderSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

@connect(
  state => ({
    requisitions: state.requisitions,
    formVisibility : state.requisitions.queryHeaderFormVisiblility
  }),
  dispatch => bindActionCreators(reqsQHeaderActions, dispatch)
)

export default class QueryHeaderList extends Component {
  constructor (props, context) {
    super(props);
  }

  propTypes: {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    moveQueryHeader: PropTypes.func.isRequired
  }

  editQueryHeader(e) {  // simply replaces the header shown with a form
    e.preventDefault();
    let { editReqQueryHeaderInForm, query } = this.props;
    editReqQueryHeaderInForm( query );
  }

  testQueryHeader(e) {  // simply replaces the header shown with a form
    e.preventDefault();
    let { testReqQueryHeaderInForm, currentReq } = this.props || {};
    testReqQueryHeaderInForm( currentReq );
  }

  render() {
    // dnd specific
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    const { query, query: {header, _id}, formVisibility, currentReq } = this.props;

    const styleForm = {
      backgroundColor: 'yellow'
    }
    let formStatus;

    if ( formVisibility && Boolean(formVisibility.showForm) && Boolean(formVisibility.queryHeader) && (formVisibility.queryHeader._id === _id) ) {
      formStatus = (
        <div style={styleForm}>
          <h4>Edit Query Header</h4>
          <ReqsQueryHeaderForm queryHeader={formVisibility.queryHeader}
            currentReq={currentReq} />
        </div>
      )
    } else {
      formStatus = (
        <div style={{ ...style, opacity }}>
          <span ref='dragHandle' style={styleForm}>drag</span>&nbsp;
          <span>{header}</span>
          <button type="button"
            className="btn btn-link btn-sm"
            onClick={::this.editQueryHeader}>
              edit
          </button>

          <button type="button"
            className="btn btn-link btn-sm"
            onClick={::this.testQueryHeader}>
              test
          </button>

        </div>
      )
    }

    return connectDragSource(connectDropTarget(
      <div>
        {formStatus}
      </div>
    ));
  }
}
