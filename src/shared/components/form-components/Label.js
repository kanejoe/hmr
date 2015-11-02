import React, { Component, PropTypes } from 'react';

export default class Label extends Component {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    width: PropTypes.string
  }

  static defaultProps = {
    className: 'form-control-label',
    style: null,
    id: null
  }

  render() {
    return (
      <label
        htmlFor={this.props.id}
        className={this.props.className + ' ' + this.props.width}
        style={this.props.style}>
        {this.props.name}
      </label>
    );
  }
}
