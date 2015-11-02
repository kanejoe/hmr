import React, { Component, PropTypes } from 'react';

export default class Submit extends Component {
  static defaultProps = {
    className: 'btn btn-primary',
    style: null,
    disabled: false
  }

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ])
  }

  render() {
    return (
      <button
        type="submit"
        className={this.props.className}
        style={this.props.style}
        disabled={this.props.disabled}>
        {this.props.children}
      </button>
    );
  }
}
