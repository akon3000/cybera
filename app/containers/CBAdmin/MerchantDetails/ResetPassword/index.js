import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Field, reduxForm } from 'redux-form/immutable';
import IconLock from 'react-icons/lib/fa/lock';
import TextField from 'material-ui/TextField';
import QuesionIcon from 'react-icons/lib/fa/question';

import { apiUrl } from '../../../../config';
import SuccessPopup from '../../../../components/SuccessPopup';
import Dialog from '../../../../components/Dialog';
import styles from './styles.css';
import Button from '../../../../../app/components/Button';
import Loading from '../../../../../app/components/Loading';
import ErrorBox from '../../../../../app/components/ErrorBox';
import message from '../../../../Message';
import validate from '../../../../utils/validate';
import request from '../../../../utils/request';

function Input ({ input, label, type, hintText, icon, meta: { touched, error }}) { // eslint-disable-line
  return (
    <div className={`${styles.textField}`}>
      {icon}
      <TextField
        data-automation-id="textfield-merchant-password-reset"
        errorText={touched && error}
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
  constructor(props) {
    super(props);
    this.state = {
      isSent: false,
      isLoading: false,
      error: false,
      UserId: props.UserId,
    };
  }

  submit(values) {
    this.setState({ isLoading: true });

    request.put(
      `${apiUrl}/Users/${this.state.UserId}/ResetPassword`,
      {
        Password: values.get('password'),
        RePassword: values.get('repassword'),
      },
      (response) => {
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
    if (this.state.isSent) {
      return (
        <SuccessPopup
          onClose={this.props.onClose}
          data-automation-id="dialog-merchant-password-reset-success"
        >
          <h3>You have been successful</h3>
          <div>Merchant password has been changed</div>
        </SuccessPopup>
      );
    }

    return (
      <Dialog
        title="Update Merchant Password"
        onClose={this.props.onClose}
        data-automation-id="dialog-merchant-password-reset-success"
      >
        <form data-automation-id="form-merchant-password-reset" onSubmit={this.props.handleSubmit((values) => this.submit(values))}>
          <Row center="xs">
            <Col xs={12}>
              <div>Update Merchant Password</div>
              { this.state.error &&
                <ErrorBox
                  data-automation-id="error-merchant-password-reset"
                  error={this.state.error}
                  onClose={() => this.setState({ error: false })}
                  style={{ marginTop: '5px' }}
                />
              }
            </Col>
            <Col xs={12} md={8} className={`${styles.textFieldContainer} ${styles.passwordField}`}>
              <Field data-automation-id="field-merchant-password-reset-input" label="password" name="password" hintText="New Password" type="password" component={Input} icon={<IconLock />} />
              <div className={styles.help}>
                <div className={styles.helpText}>Password needs to have 6 - 12 characters and at least one number. No spaces.</div>
                <QuesionIcon />
              </div>
            </Col>
            <Col xs={12} md={8} className={styles.textFieldContainer}>
              <Field
                label="repassword"
                name="repassword"
                hintText="Confirm New Password"
                type="password"
                component={Input}
                icon={<IconLock />}
                data-automation-id="field-merchant-password-reset-input-confirm"
              />
            </Col>
            <Col xs={12} md={5}>
              <Button data-automation-id="btn-merchant-password-reset" id="UpdatePassword" type="submit" style={{ marginTop: '15px' }}>
                Update
              </Button>
            </Col>
          </Row>
        </form>
        { this.state.isLoading && <Loading /> }
      </Dialog>
    );
  }
}

ResetPasswordPopup.propTypes = {
  handleSubmit: PropTypes.func,
  onClose: PropTypes.func,
  UserId: PropTypes.string,
};

export default reduxForm({
  form: 'ResetPasswordPopup',
  validate: validateResetPassword,
})(ResetPasswordPopup);
