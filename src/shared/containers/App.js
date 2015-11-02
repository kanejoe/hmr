import React, { Component, PropTypes, contextTypes } from 'react';
import { connect } from 'react-redux';
import Reqs from './Reqs';

if (process.env.BROWSER) {
  import css from './css/app.css'
}

@connect(state => ({ routerState: state.router }))

class App extends Component {
  constructor (props, context) {
    super(props);
    console.dir(this.props.data)  // why is server data not in imm format?
  }

  render () {
    return (
      <div>
        <h4>Requisitions on Title</h4>
        <Reqs />
        <div className="Content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }),
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
    users: state.users,
    reqs: state.reqs,
    data: state.data
  };
}

export default connect(mapStateToProps)(App);
