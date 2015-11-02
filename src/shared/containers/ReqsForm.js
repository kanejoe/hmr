import React, { PropTypes, Component } from 'react';
import Radium from 'radium';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as reqsActions from '../actions/reqsActions';
import { FieldSet, Label, Input, Submit } from '../components/form-components/';
import Button from '../components/Button';
import FormWarningArea from '../components/FormWarningArea';
import formValidation from './reqsFormValidator';

if (process.env.BROWSER) {
  import fa from 'font-awesome/css/font-awesome.css';
}

/*
 * Redux’s @connect decorator wraps our class in another component ( <Connector>),
 * giving it access to the requested parts of state as props,
 * hence why we can use todos as we do. It also passes in Redux’s dispatch function which can be used to dispatch actions like so:
 * dispatch(actionCreator());
 * Finally we use redux’s bindActionCreators method to pass in… ermm… bound action creators.
 * What this means is that, in the child components, we can just call the action creators directly, without wrapping them in a dispatch() call.
*/

@connect(
  state => ({
    validate: formValidation,
    newFormVisibility: state.requisitions.newFormVisibility,
    selectedReq: state.requisitions.selectedReq,
    disableButton: state.requisitions.disableButton,
    formWarnings: state.requisitions.formWarnings,
    serverError: state.requisitions.serverError
  }),
  dispatch => bindActionCreators(reqsActions, dispatch)
)

export default class ReqsForm extends Component {

  constructor(props, context) {
    super(props, context);
    let { selectedReq: {_id, title} } = props;
    this.handleFormSubmission = this.handleFormSubmission.bind(this);
    this.state = {
      formErrors: {
        valid: true
      },
      _id, title
    }
  }

  static propTypes = {
  }

  componentWillReceiveProps(nextProps) {
    let { selectedReq: {_id, title}, formWarnings } = nextProps;  // what if _id not defined
    this.setState({
      title, _id,
      formWarnings: {}, // these are server
      formErrors: {}
    });
  }

  handleChange(value, name, event) {
    return this.setState({
      [name]: value
    });
  }

  handleFormSubmission = (e) => {
    e.preventDefault();
    const { validate, submitForm } = this.props;
    let obj = update(this.state, {
      formErrors: { $set: validate( this.state )}
    });
    this.setState(obj, () => {
      if (this.state.formErrors.valid) {
        let { formErrors, formWarnings, ...formData } = this.state;
        submitForm( formData );
      }
    });
  }

  hideForm() {
    const { showNewForm } = this.props;
    showNewForm( false );
  }

  componentDidMount() {
    this._input.focus(); // taken from react docs :: but what about putting this into the constructor function
  }

  render () {
    const { selectedReq, disableButton, formWarnings, serverError } = this.props;
    const REQS_HEADER = 'title';
    const REQS_ID = '_id';
    let { formErrors } = this.state;

    // Inline styles are supported.
    let style = {
      marginRight: '1rem'
    };

    /* below is a bit of a miss -- tidy it up */
    let spinner = (disableButton) ? (<i className="fa fa-cog fa-spin"></i>) : null;
    let serverWarnings = (formWarnings) ? ( <FormWarningArea>{formWarnings}</FormWarningArea> ) : null;
    serverWarnings = (serverError) ? ( <FormWarningArea>{serverError}</FormWarningArea> ) : null;
    let showWarnings = (serverWarnings && Object.keys(serverWarnings.props.children).length) ? serverWarnings : null;

    return (
      <form name="reqsForm" onSubmit={this.handleFormSubmission}>
        {showWarnings}
        <FieldSet name={REQS_HEADER} errorMessage={formErrors[REQS_HEADER]}>
          <Label name="Title" width="col-sm-2"/>
          <Input
            placeholder="requisition title"
            name={REQS_HEADER}
            width="col-sm-6"
            ref={(c) => this._input = c}
            onChange={::this.handleChange}
            value={this.state.title}
          />
        </FieldSet>

        <Input
          name={REQS_ID}
          onChange={::this.handleChange}
          value={this.state._id}
          type='hidden'
        />

        <Submit
          className='btn btn-danger-outline'
          disabled={disableButton}
          style={style}>
            Submit {spinner}
        </Submit>

        <Button
          text='Close'
          onClick={::this.hideForm} />

      </form>
    );
  }
}
