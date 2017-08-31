import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';

import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Input from '../../../../components/Input';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import auth from '../../../../utils/auth';
import styles from './styles.css';
import Button from '../../../../components/Button';
import message from '../../../../Message';
import validate from '../../../../utils/validate';
import Loading from '../../../../components/Loading';
import SuccessPopup from '../../../../components/SuccessPopup';
import ErrorPopup from '../../../../components/ErrorPopup';

export const validateForm = (values) => {
  const errors = {};
  const requiredFields = {
    currentPassword: 'Please enter current password',
    newPassword: 'Please enter new password',
    reNewPassword: 'Please enter confirm password',
  };

  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
  }

  const currentPassword = values.get('currentPassword');
  const newPassword = values.get('newPassword');
  const reNewPassword = values.get('reNewPassword');

  if (currentPassword && !validate.isPassword(currentPassword)) {
    errors.currentPassword = message.error.PASSWORD_INCORRECT_FORMAT;
  }

  if (newPassword && !validate.isPassword(newPassword)) {
    errors.newPassword = message.error.PASSWORD_INCORRECT_FORMAT;
  }

  if (reNewPassword && !validate.isPassword(reNewPassword)) {
    errors.reNewPassword = message.error.PASSWORD_INCORRECT_FORMAT;
  }

  if (
    newPassword && validate.isPassword(newPassword)
    && reNewPassword && validate.isPassword(reNewPassword)
    && newPassword !== reNewPassword
  ) {
    errors.reNewPassword = 'Confirm password does not match the new password';
  }

  return errors;
};

export class AccountSettings extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
    };
  }

  componentDidMount() {
    auth.getUser((user) => {
      this.setState({ user });
      const initData = {
        userID: user.Id,
      };
      this.props.initialize(initData);
      this.setState({ loading: false });
    });
  }

  submit(values) {
    this.setState({ loading: true });
    request.put(
      `${apiUrl}/Users/${values.get('userID')}/MerchantResetPassword`,
      {
        OldPassword: values.get('currentPassword'),
        Password: values.get('newPassword'),
        RePassword: values.get('reNewPassword'),
      },
      (response) => {
        if (!response.error) {
          this.setState({
            submitMessage: 'Your password has been changed',
            MerchantPopupShow: true,
          });
        } else {
          this.setState({
            ErrorPopupShow: true,
            submitMessage: response.error });
        }
        this.setState({ loading: false });
        auth.updateUser(() => {});
      }
    );
  }

  render() {
    const { handleSubmit } = this.props;
    const popup = [];

    if (this.state.MerchantPopupShow) {
      popup.push(
        <SuccessPopup
          key="UpdateProfilePopupWindow"
          data-automation-id="dialog-account-setting-success"
          onClose={() => {
            this.setState({ MerchantPopupShow: false });
            this.props.history.push('/MCAdmin');
          }}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.ErrorPopupShow) {
      popup.push(
        <ErrorPopup
          key="error-popup"
          data-automation-id="error-account-setting"
          error={this.state.submitMessage}
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-account-setting" isLoading={this.state.loading}>
        <BreadCrumb
          data-automation-id="breadcrumb-account-setting"
          breadCrumb={[
            <button data-automation-id="btn-update-profile-link" key="User" onClick={() => this.props.history.push('/MCAdmin/User/UpdateProfile')}>User</button>,
            <button data-automation-id="btn-account-setting-link" key="Reset Password" onClick={() => window.location.reload()}>Reset Password</button>,
          ]}
        />
        <h2>Reset Password</h2>
        <Box>
          <br />
          <form
            data-automation-id="form-account-setting"
            onSubmit={handleSubmit((values) => {
              this.submit(values);
            })}
          >
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-account-setting-currentpassword" label="Current password" name="currentPassword" type="password" component={Input} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-account-setting-newpassword" label="New password" name="newPassword" type="password" component={Input} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-account-setting-newpasswordconfirm" label="Confirm password" name="reNewPassword" type="password" component={Input} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} className={styles.buttons}>
                <Button data-automation-id="btn-account-setting-submit" type="submit">Save</Button>
                <Button data-automation-id="btn-account-setting-cancel" type="button" btnStyle="negative" onClick={() => this.props.history.push('/MCAdmin')}>Cancel</Button>
              </Col>
            </Row>
          </form>
        </Box>
        { popup }
        { this.state.loading && <Loading /> }
      </Layout>
    );
  }
}

AccountSettings.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({ // eslint-disable-line
  form: 'UpdateProfile',
  validate: validateForm,
})(AccountSettings);
