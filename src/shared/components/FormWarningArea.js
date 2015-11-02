import React, { Component, PropTypes, Children } from 'react';
import createFragment from 'react-addons-create-fragment';
import Radium from 'radium';
import color from 'color';

@Radium

class FormWarningArea extends Component {
  constructor(props, context) {
    super(props, context);
  }

  static defaultProps = {
  }

  static propTypes = {
  }

  render() {
    const { children, children: { details } } = this.props; // what if these do not exist
    var joi = (details) ? ( <ul> { details.map((r, i) => <li key={i}>{r.message}</li> )} </ul> ) : ( <ul><li>{children}</li></ul> );

    return (
      <div style={[styles.base, styles[this.props.kind]]}>
        <h4>There were errors submitting this form</h4>
        <div>{ joi }</div>
      </div>
    )
  }
}

const styles = {
  base: {
    padding: '1.5em 2em',
    border: 0,
    borderRadius: 6,
    margin: 20,
    color: '#000',
    //background: color('#fbb1b1'),
    fontSize: 16,
    fontWeight: 700,
    transition: 'background-color 0.5s ease',
    ':hover': {
      background: color('#fbb1b1').darken(0.05).hexString()
    }
  }
};


export default FormWarningArea;
