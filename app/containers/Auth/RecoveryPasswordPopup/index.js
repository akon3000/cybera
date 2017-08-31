import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { Row, Col } from 'react-flexbox-grid';
import { Field, reduxForm } from 'redux-form/immutable';
import IconAt from 'react-icons/lib/ti/at';
import TextField from 'material-ui/TextField';
import IconClose from 'react-icons/lib/md/close';

import styles from './styles.css';
import Button from '../../../../app/components/Button';
import ErrorBox from '../../../../app/components/ErrorBox';
import auth from '../../../utils/auth';
import validate from '../../../utils/validate';
import message from '../../../Message';
import Loading from '../../../../app/components/Loading';
import logo from '../../../assets/image/logoBlack.png';

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

export const recoveryPasswordValidate = (values) => {
  const errors = {};
  const requiredFields = {
    email(value) {
      if (!value) return message.format('require_enter', 'email address');
      const maxLength = validate.isValidLength(value, 100, 'Email address');
      if (maxLength !== true) return maxLength;
      if (!validate.isEmail(value)) return message.error.NOT_VALID_EMAIL;
      return true;
    },
  };

  Object.keys(requiredFields).forEach((key) => {
    const err = requiredFields[key](values.get(key));
    if (err !== true) errors[key] = err;
  });

  return errors;
};

class RecoveryPasswordPopup extends React.Component {
  constructor() {
    super();
    this.state = {
      isSent: false,
      isLoading: false,
      error: false,
      email: '',
      customContentStyle: {
        maxWidth: '600px',
        boxShadow: 'none',
      },
    };
  }

  submit = (fields) => {
    this.setState({ isLoading: true });
    auth.forgotPassword(fields.get('email'), (response) => {
      if (!response.error) {
        this.setState({
          isSent: true,
          email: fields.get('email'),
          error: false,
        });
      } else {
        this.setState({ error: response.error });
      }

      this.setState({ isLoading: false });
    });
  }

  render() {
    const actions = [];
    const body = [];

    actions.push(<button data-automation-id="btn-close" id="CloseRecoveryPasswordPopup" className={styles.popupClose} onClick={this.props.onClose}><IconClose /></button>);
    if (!this.state.isSent) {
      body.push(
        <Col key="col1" xs={12}>
          <h1>Password recovery</h1>
          <p>Please enter your email address below to reset your password</p>
        </Col>);
      body.push(
        <Col key="col2" xs={8} className={styles.textFieldContainer}>
          <Field data-automation-id="input-email" label="email" name="email" hintText="Email" type="text" component={Input} icon={<IconAt />} />
        </Col>);
      body.push(
        <Col key="col3" xs={7}>
          <Button data-automation-id="btn-reset" id="ResetPassword" type="submit" className={styles.btnSignIn}>
            Reset
          </Button>
        </Col>
      );
    } else {
      body.push(
        <Col key="col1" xs={12}>
          <h1>Reset password email has been sent</h1>
          <p>
            <br /><br />
            We just sent an email to {this.state.email} <br />
            Please check your email inbox and click the link to reset your password
          </p>
        </Col>);
    }

    return (
      <Dialog
        actions={actions}
        modal={Boolean(true)}
        open={Boolean(true)}
        onTouchTap={this.props.onClose}
        contentStyle={this.state.customContentStyle}
        className={styles.popup}
      >
        <form onSubmit={this.props.handleSubmit(this.submit)} data-automation-id="form-recovery-password">
          <Row center="xs">
            <Col xs={12}>
              <img className={styles.logo} src={logo} alt="Cybera" data-automation-id="image-logo" />
            </Col>
            { this.state.error &&
              <Col xs={12}>
                <ErrorBox data-automation-id="ErrorBox" error={this.state.error} onClose={() => this.setState({ error: false })} />
              </Col>
            }
            {body}
          </Row>
        </form>
        { this.state.isLoading && <Loading data-automation-id="loading-recovery-password" /> }
      </Dialog>
    );
  }
}

RecoveryPasswordPopup.propTypes = {
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default reduxForm({ // eslint-disable-line
  form: 'RecoveryPasswordPopup', // a unique name for this form
  validate: recoveryPasswordValidate,                // <--- validation function given to redux-form
})(RecoveryPasswordPopup);
