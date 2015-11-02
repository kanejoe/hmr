import React, { Component, PropTypes, Children, cloneElement } from 'react';
import assign from 'object-assign';

export default class FieldSet extends Component {
  constructor(props) {
    super(props);
    this.cloneChild = this.cloneChild.bind(this);
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    hasError: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string
  }

  static defaultProps = {
    className: 'form-group row',
    hasError: false,
    errorClass: 'has-error',
    errorMessage: '',
    style: null
  }

  /*
  The resulting element will have the original element's props with the new props merged in shallowly. New children will replace existing children
  */
  cloneChild = (child) => {
    const newProps = assign({
      ...child.props
    },{
      id: this.props.name // get the name from fieldset, convert to id and set this on the input and label. Q: what about submit???
    });
    return cloneElement(
      child,
      newProps
    );
  }

  render() {
    let { errorClass, errorMessage } = this.props;
    let displayError = (errorMessage.length > 0) ? ' ' + errorClass : '';

    if (!Array.isArray(this.props.children)) {
      const child = this.props.children;
      return (
        <div>
          className={this.props.className + displayError}
          style={this.props.style}>
          { this.cloneChild(child) }
        </div>
      );
    } else {
      return (
        <div
          className={this.props.className + displayError}
          style={this.props.style}>
          { Children.map(this.props.children, this.cloneChild) }
          <small className='help-block'>{errorMessage}</small>
        </div>
      );
    }
  }
}
