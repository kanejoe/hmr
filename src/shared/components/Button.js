import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Button extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.text || ''
    };
  }

  static defaultProps = {
    disabled: false
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick();
  }

  render() {
    let { className } = this.props;

    var classes = classNames(
      className, {
        'btn btn-primary': !this.props.className // this is the default if no style given
      }
    );

    return (
      <button
        className={classes}
        type="button"
        disabled={this.props.disabled}
        onClick={this.handleClick.bind(this)}
        type="button">{this.props.text}</button>
    );
  }
}

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default Button;
