import React, { Component, PropTypes } from 'react';

export default class Input extends React.Component {
  constructor(props, context) {
    super(props, context); //The super keyword lets us call the parent object that is being inherited
    this.clear = this.clear.bind(this);
    this.focus = this.focus.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    width: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onChange: PropTypes.func
  }

  static defaultProps = {
    type: 'text',
    className: 'form-control',
    style: null
  }

  focus = () => this.refs[this.props.name].focus();

  clear = () => {
    this.refs[this.props.name].value = '';
  }

  handleChange(e) {
    e.preventDefault();
    if (this.props.onChange) {
      this.props.onChange(e.target.value, this.props.name, e);
    }
  }

  render() {
    //console.dir(this.props)
    return (
      <div className={this.props.width}>
        <input
          {...this.props}
          ref={this.props.name}
          id={this.props.id}
          name={this.props.name}
          className={this.props.className}
          style={this.props.style}
          onChange={::this.handleChange}
          value={this.props.value}
        />
      </div>
    );
  }
}
