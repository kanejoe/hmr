import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import Radium from 'radium';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as reqsQHeaderActions from '../actions/reqsQHeaderActions';
import { FieldSet, Label, Input, Submit } from '../components/form-components/';
import Button from '../components/Button';
import formValidation from './validation/queryHeaderFormValidation';

@connect(
  state => ({
    validate: formValidation,
    requisitions: state.requisitions,
    formVisibility : state.requisitions.queryHeaderFormVisiblility
  }),
  dispatch => bindActionCreators(reqsQHeaderActions, dispatch)
)

export default class ReqsQueryHeaderForm extends Component {

  constructor(props, context) {
    super(props, context);
    const { queryHeader } = props || {};
    const { _id, header } = queryHeader || {};

    this.handleFormSubmission = this.handleFormSubmission.bind(this);
    this.state = {
      formErrors: {
        valid: true
      }, _id, header
    }
  }

  static propTypes = {
    currentReq: PropTypes.object.isRequired
  }

  handleChange(value, name, event) {
    return this.setState({
      [name]: value
    });
  }

  handleFormSubmission = (e) => {
    if (e) e.preventDefault();
    const { validate, submitForm, currentReq } = this.props;

    let obj = update(this.state, {
      formErrors: { $set: formValidation( this.state )}
    });
    //console.dir(obj)
    this.setState(obj, () => {
      if (this.state.formErrors.valid) {
        let { formErrors, formWarnings, ...formData } = this.state;
        submitForm( formData, currentReq._id );
      }
    });
  }

  hideForm(e) {
    if (e) e.preventDefault();
    const { closeReqQueryHeaderInForm } = this.props;
    closeReqQueryHeaderInForm();
  }

  componentDidMount() {
    const input = this._input;
    const len = (input.props.value) ? input.props.value.length * 2 : 0;
    input.focus();
    //input.props.setSelectionRange(len, len);
  }

  render () {
    let { formErrors } = this.state;
    const REQS_HEADER = 'header';
    let style = {
      marginRight: '1em'
    };

    return (
      <form name="reqsForm" onSubmit={ this.handleFormSubmission }>

        <FieldSet name={REQS_HEADER} errorMessage={formErrors[REQS_HEADER]}>
          <Label name='Query Header' width="col-sm-2"/>
          <Input
            placeholder="header query"
            name={REQS_HEADER}
            width="col-sm-6"
            ref={(c) => this._input = c}
            onChange={::this.handleChange}
            value={this.state.header}
          />
        </FieldSet>

        <Submit
          className='btn btn-danger-outline'
          style={style}>
            Submit
        </Submit>

        <Button text='Close'
          onClick={::this.hideForm} />

      </form>
    );
  }
}
