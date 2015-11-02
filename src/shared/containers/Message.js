import React, { findDOMNode, Component, PropTypes } from 'react';
import * as reqsQHeaderActions from '../actions/reqsQHeaderActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../components/Button';
import QueryHeads from './QueryHeads';
import ReqsQueryHeaderForm from './ReqsQueryHeaderForm';

@connect(
  state => ({
    requisitions: state.requisitions,
    data: state.data,
    formVisibility : state.requisitions.queryHeaderFormVisiblility
  }),
  dispatch => bindActionCreators(reqsQHeaderActions, dispatch)
)

export default class Message extends Component {
  constructor (props, context) {
    super(props);
    this.state = {
      req: null
    }
  }

  componentDidMount () { // Invoked once, only on the client (not on the server), immediately after the initial rendering occurs
    this.fetchReq()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.params.id !== this.props.params.id) // update
      this.fetchReq()
  }

  fetchReq() {
    let {routeParams: {id}, requisitions: {reqs}} = this.props;
    let req = reqs.find(r => (r._id).toString() === id);  // need to convert to string as on SSR is bson type
    this.setState({
      req
    })
  }

  showAddForm(e) {
    if (e) e.preventDefault();
    const { editReqQueryHeaderInForm } = this.props;
    editReqQueryHeaderInForm();
  }

  render() {
    const { formVisibility } = this.props;
    const { req } = this.state;
    const showHideForm = (formVisibility && Boolean(formVisibility.showForm) && !Boolean(formVisibility.queryHeader))
      ? ( <ReqsQueryHeaderForm currentReq={req} /> )
      : ( <Button text={'Add New Query Header'} onClick={::this.showAddForm} /> ) ;

    let queryHeaders = (req && req.queries && req.queries.length) ? (<QueryHeads queryheads={req.queries} currentReq={req} />) : (<div>No Query Headings</div>);
    // send the title as a separate header
    return (
      <div>
        {showHideForm}
        {queryHeaders}
      </div>
    )
  }
}
