import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
const { toJS } = Immutable;
import moment from 'moment';
//import fa from 'font-awesome/css/font-awesome.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReqsListItem from './ReqsListItem';
import ReqsForm from './ReqsForm';
import * as reqsActions from '../actions/reqsActions';
import Button from '../components/Button';

//@DragDropContext(HTML5Backend) // unable to turn on ES7 decorators -- answer: remove the semi-colon!!
@connect(
  state => ({
    reqs: state.requisitions.reqs,
    data: state.data,
    newFormVisibility: state.requisitions.newFormVisibility
  }),
  dispatch => bindActionCreators(reqsActions, dispatch)
)

export default class Reqs extends Component {

  constructor(props, context) {
    super(props);
  }

  showForm() {
    const { showNewForm } = this.props;
    showNewForm( true );
  }

  render () {
    let { data, reqs, newFormVisibility } = this.props;
    console.dir(data)
    //console.dir(data.first().toJS())
    let style = {
      marginBottom: '1rem',
      marginTop: '1rem'
    };

    let btnOrForm = (newFormVisibility) ? <ReqsForm /> : <Button text="Show Form" onClick={::this.showForm} className='btn btn-danger'/>;

    return (
      <div>
        <ul className="list-group" style={ style }>
          {reqs.map((r, i) =>
            <ReqsListItem
              index={i}
              req={r}
              key={r._id}
            />
          )}
        </ul>
        { btnOrForm }
      </div>
    );
  }
}
