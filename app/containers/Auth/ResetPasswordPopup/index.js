import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { Row, Col } from 'react-flexbox-grid';
import { Field, reduxForm } from 'redux-form/immutable';
import IconLock from 'react-icons/lib/fa/lock';
import TextField from 'material-ui/TextField';
import QuesionIcon from 'react-icons/lib/fa/question';
import IconClose from 'react-icons/lib/md/close';

import styles from './styles.css';
import Button from '../../../../app/components/Button';
import Loading from '../../../../app/components/Loading';
import ErrorBox from '../../../../app/components/ErrorBox';
import logo from '../../../assets/image/logoBlack.png';
import message from '../../../Message';
import validate from '../../../utils/validate';
import auth from '../../../utils/auth';
import { getParameterByName } from '../../../utils';

function Input (props) { // eslint-disable-line
  const { input, type, hintText, icon, meta: { touched, error } } = props; // eslint-disable-line
  return (
    <div
      className={`${styles.textField}`}
      data-automation-id={props['data-automation-id']} // eslint-disable-line
    >
      {icon}
      <TextField
        errorText={touched && error && <span data-automation-id="error">{error}</span>}
        {...input}
        type={type}
        hintText={hintText}
      />
    </div>
  );
}

export const validateResetPassword = (values) => {
  const errors = {};

  const requiredFields = [
    'password',
    'repassword',
  ];

  requiredFields.forEach((field) => {
    if (!values.get(field)) {
      errors[field] = ' ';
    }
  });

  if (!validate.isPassword(values.get('password'))) {
    errors.password = message.error.PASSWORD_INCORRECT_FORMAT;
  }

  if (!validate.isPassword(values.get('repassword'))) {
    errors.repassword = message.error.PASSWORD_INCORRECT_FORMAT;
  }

  if (values.get('password') && (values.get('password')).length && values.get('repassword') !== values.get('password')) {
    errors.repassword = 'Confirm password does not match the new password.';
  }

  return errors;
};

class ResetPasswordPopup extends React.Component {
  constructor() {
    super();
    this.state = {
      isSent: false,
      isLoading: false,
      error: false,
    };
  }

  onClose() {
    window.location = '/';
  }

  submit(values) {
    this.setState({ isLoading: true });

    auth.resetPassword(
    getParameterByName('key'),
    getParameterByName('value'),
    values.get('password'),
    values.get('repassword'), (response) => {
      if (!response.error) {
        this.setState({
          isLoading: false,
          isSent: true,
        });
      } else {
        this.setState({
          isLoading: false,
          error: response.error,
        });
      }
    });
  }

  render() {
    const actions = [];
    const body = [];

    actions.push(<button data-automation-id="btn-close" id="CloseResetPasswordPopup" className={styles.popupClose} onClick={this.onClose}><IconClose /></button>);

    if (!this.state.isSent) {
      body.push(
        <Col key="col1" xs={12}>
          <h1>New password</h1>
          <div>Please pick a new password to complete the reset process.<br />
          You will use this new password to sign in to the site from now on.

            <br />
            <br />
            { this.state.error &&
              <Col xs={12}>
                <ErrorBox data-automation-id="error-box" error={this.state.error} onClose={() => { this.setState({ error: false }); }} />
              </Col>
            }
          </div>
        </Col>);
      body.push(
        <Col key="col2" xs={8} className={`${styles.textFieldContainer} ${styles.passwordField}`}>
          <Field data-automation-id="input-new-password" label="password" name="password" hintText="New Password" type="password" component={Input} icon={<IconLock />} />
          <div className={styles.help}>
            <div className={styles.helpText}>Password needs to have 6 - 12 characters and at least one number. No spaces.</div>
            <QuesionIcon className={styles.helpIcon} />
          </div>
        </Col>);
      body.push(
        <Col key="col3" xs={8} className={styles.textFieldContainer}>
          <Field data-automation-id="input-re-password" label="repassword" name="repassword" hintText="Confirm New Password" type="password" component={Input} icon={<IconLock />} />
        </Col>);
      body.push(
        <Col key="col4" xs={7}>
          <Button data-automation-id="btn-update" id="UpdatePassword" type="submit" className={styles.btnSignIn}>
            Update
          </Button>
        </Col>
      );
    } else {
      body.push(
        <Col key="col1" xs={12}>
          <h1>Reset password</h1>
          <div>Your password has been changed.
          </div>
        </Col>);

      body.push(
        <Col key="col4" xs={7}>
          <Button data-automation-id="btn-signin" id="GoToSignIn" type="button" className={styles.btnSignIn} onClick={() => { this.props.onClickSignIn(); }}>
            Sign In
          </Button>
        </Col>
      );
    }

    return (
      <Dialog
        actions={actions}
        modal={Boolean(true)}
        open={Boolean(true)}
        onTouchTap={this.onClose}
        contentStyle={{ maxWidth: '600px', boxShadow: 'none' }}
        className={styles.popup}
      >
        <form onSubmit={this.props.handleSubmit((values) => this.submit(values))} data-automation-id="form-reset-password">
          <Row center="xs">
            <Col xs={12}>
              <img className={styles.logo} src={logo} alt="Cybera" data-automation-id="image-logo" />
            </Col>
            {body}
          </Row>
        </form>
        { this.state.isLoading && <Loading data-automation-id="loading-reset-password" /> }
      </Dialog>
    );
  }
}

ResetPasswordPopup.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onClickSignIn: PropTypes.func,
};

export default reduxForm({
  form: 'ResetPasswordPopup',
  validate: validateResetPassword,
})(ResetPasswordPopup);
