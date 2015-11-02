import React, { findDOMNode, Component, PropTypes } from 'react';
import * as reqsQHeaderActions from '../actions/reqsQHeaderActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import QueryHeadsList from './QueryHeadsList';

@DragDropContext(HTML5Backend)

@connect(
  state => ({
    requisitions: state.requisitions
  }),
  dispatch => bindActionCreators(reqsQHeaderActions, dispatch)
)

export default class QueryHeads extends Component {
  constructor (props, context) {
    super(props);
    this.moveQueryHeader = this.moveQueryHeader.bind(this);
  }

  propTypes: {
    queryheads: React.PropTypes.array.isRequired
  }

  moveQueryHeader(dragIndex, dropIndex, query) { // dragIndex is starting; hoverIndex is ending (should be dropIndex)
    const { dndQueryHeaders } = this.props;
    dndQueryHeaders( query, dragIndex, dropIndex )
  }

  render() {
    const { queryheads, currentReq } = this.props || {};
    const { title } = currentReq || {};
    let len = ((queryheads).length === 1) ? ('there is 1 query header') : (`There are ${queryheads.length} query headings.`);

    return (
      <div>
        <h3>{title}</h3>
        {len}
        {queryheads.map((q, i) =>
          <QueryHeadsList
            index={i}
            query={q}
            currentReq={currentReq}
            key={q._id}
            moveQueryHeader={this.moveQueryHeader}
          />
        )}
      </div>
    )
  }
}
