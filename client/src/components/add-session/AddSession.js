import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addSession } from '../../actions/sessionActions';
import { getProfileByHandle } from '../../actions/profileActions';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

class AddSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      class: '',
      information: '',
      type: '',
      scheduledStart: '',
      scheduledEnd: '',
      profileHandle: this.props.match.params.tutorHandle,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const sessionData = {
      handle: this.state.profileHandle,
      class: this.state.class,
      type: 'Scheduled Appointment',
      scheduledStart: this.state.scheduledStart,
      information: this.state.information
    };

    this.props.addSession(sessionData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCheck(e) {
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current
    });
  }

  render() {
    const { errors } = this.state;
    const { session, loading } = this.props;

    if (session == null || loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="add-education">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <Link to="/tutors" className="btn btn-light">
                  Go Back
                </Link>
                <h1 className="display-4 text-center">
                  Schedule Tutoring Session
                </h1>
                <p className="p lead text-center">
                  Schedule a tutoring session with {this.state.profileHandle}
                </p>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder={this.state.profileHandle}
                    name="tutor"
                    value={this.state.profileHandle}
                    onChange={this.onChange}
                    error={errors.tutor}
                    disabled="disabled"
                  />
                  <TextFieldGroup
                    placeholder="* Class"
                    name="class"
                    value={this.state.class}
                    onChange={this.onChange}
                    error={errors.class}
                  />
                  <TextFieldGroup
                    placeholder="Scheduled Appointment"
                    name="type"
                    value="Scheduled Appointment"
                    onChange={this.onChange}
                    error={errors.type}
                    disabled="disabled"
                  />
                  <h6>Date and Time</h6>
                  <TextFieldGroup
                    name="scheduledStart"
                    type="datetime-local"
                    value={this.state.scheduledStart}
                    onChange={this.onChange}
                    error={errors.scheduledStart}
                  />
                  <TextAreaFieldGroup
                    placeholder="Information"
                    name="information"
                    value={this.state.information}
                    onChange={this.onChange}
                    error={errors.information}
                    info="Any additional information that is needed"
                  />
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

AddSession.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addSession: PropTypes.func.isRequired,
  getProfileByHandle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  session: state.session,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addSession, getProfileByHandle }
)(withRouter(AddSession));
