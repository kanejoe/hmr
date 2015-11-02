import React, { findDOMNode, Component, PropTypes } from 'react';

export default class AddReqHeader extends Component {
  render() {
    return (
      <div>
        <input type='text' ref='inputReqHeader' />
        <button onClick={(e) => this.handleClick(e)}>
          Add
        </button>
      </div>
    );
  }

  handleClick(e) {
    const node = findDOMNode(this.refs.inputReqHeader);
    const text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  }
}

AddReqHeader.propTypes = {
  onAddClick: PropTypes.func.isRequired
};
