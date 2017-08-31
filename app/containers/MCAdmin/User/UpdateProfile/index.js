import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';

import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Input from '../../../../components/Input';
import InputDateMonthYear from '../../../../components/InputDateMonthYear';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import RadioGroup from '../../../../components/RadioGroup';
import auth from '../../../../utils/auth';
import styles from './styles.css';
import Button from '../../../../components/Button';
import Loading from '../../../../components/Loading';
import ErrorPopup from '../../../../components/ErrorPopup';
import SuccessPopup from '../../../../components/SuccessPopup';
import validate from '../../../../utils/validate';
import { formatDate, stringToDate } from '../../../../utils';

export const titleAPI = `${apiUrl}/title`;

export const updateprofileValidate = (values) => {
  const errors = {};
  const requiredFields = {
    firstName: 'Please enter first name',
    lastName: 'Please enter last name',
    dateOfBirth: 'Please enter date of birth',
    contactNumber: 'Please enter contact number',
  };

  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
  }

  if (values.get('firstName')) {
    const isValidLength = validate.isValidLength(values.get('firstName'), 50, 'First name');
    const isName = validate.isName(values.get('firstName'), "-'.");
    if (isValidLength !== true && isName !== true) {
      errors.firstName = `${isValidLength}.  ${isName}.`;
    } else if (isValidLength !== true) {
      errors.firstName = isValidLength;
    } else if (isName !== true) {
      errors.firstName = isName;
    }
  }

  if (values.get('lastName')) {
    const isValidLength = validate.isValidLength(values.get('lastName'), 50, 'Last name');
    const isName = validate.isName(values.get('lastName'), "-'.");
    if (isValidLength !== true && isName !== true) {
      errors.lastName = `${isValidLength}.  ${isName}.`;
    } else if (isValidLength !== true) {
      errors.lastName = isValidLength;
    } else if (isName !== true) {
      errors.lastName = isName;
    }
  }

  if (values.get('dateOfBirth')) {
    const isValidLength = validate.isValidLength(values.get('dateOfBirth'), 10, 'Date of Birth');
    const matchDateOfBrith = validate.matchDateOfBirth(values.get('dateOfBirth'));
    if (isValidLength !== true && matchDateOfBrith !== true) {
      errors.dateOfBirth = `${isValidLength}.  ${matchDateOfBrith}.`;
    } else if (isValidLength !== true) {
      errors.dateOfBirth = isValidLength;
    } else if (matchDateOfBrith !== true) {
      errors.dateOfBirth = matchDateOfBrith;
    }
  }

  if (values.get('contactNumber')) {
    const isValidLength = validate.isValidLength(values.get('contactNumber'), 14, 'Contact number');
    const matchContactNumber = validate.matchContactNumber(values.get('contactNumber'));
    if (isValidLength !== true && matchContactNumber !== true) {
      errors.contactNumber = `${isValidLength}.  ${matchContactNumber}.`;
    } else if (isValidLength !== true) {
      errors.contactNumber = isValidLength;
    } else if (matchContactNumber !== true) {
      errors.contactNumber = matchContactNumber;
    }
  }

  return errors;
};

export class UpdateProfile extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
    };
  }

  componentDidMount() {
    request.get(titleAPI, {}, (response) => {
      if (response.data) {
        this.setState({ title: response.data.Items });
      }
    });
    auth.getUser((user) => {
      this.setState({ user });
      const initData = {
        userID: user.Id,
        firstName: user.FirstName,
        lastName: user.LastName,
        title: user.Title.Id,
        contactNumber: user.PhoneNumber,
        email: user.Email,
        dateOfBirth: formatDate(user.BirthDate),
        newsletterSubscriptionStatus: true,
      };
      this.props.initialize(initData);
      this.props.initialize(initData);
      this.setState({ loading: false });
    });
  }

  onClickCancel() {
    this.props.history.push('/MCAdmin');
  }

  submit(values) {
    this.setState({ loading: true });
    request.put(
      `${apiUrl}/User/Merchant/${values.get('userID')}`,
      {
        Id: values.get('userID'),
        FirstName: values.get('firstName'),
        LastName: values.get('lastName'),
        PhoneNumber: values.get('contactNumber'),
        BirthDate: stringToDate(values.get('dateOfBirth')).toUTCString(),
        TitleId: values.get('title'),
        Email: values.get('email'),
      },
      (response) => {
        if (!response.error) {
          this.setState({
            submitMessage: 'Contact details updated',
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
          data-automation-id="dialog-update-profile-success"
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
          data-automation-id="error-update-profile"
          error={this.state.submitMessage}
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-update-profile">
        <BreadCrumb
          data-automation-id="breadcrumb-update-profile"
          breadCrumb={[
            <button data-automation-id="btn-update-profile-link" key="User" onClick={() => window.location.reload()}>User</button>,
            <button data-automation-id="btn-update-profile-link" key="Update Profile" onClick={() => window.location.reload()}>Update Profile</button>,
          ]}
        />
        <h2>Update Profile</h2>
        <Box>
          <form
            data-automation-id="form-update-profile"
            onSubmit={handleSubmit((values) => {
              this.submit(values);
            })}
          >
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-update-profile-email" label="Email" name="email" type="text" component={Input} disabled={Boolean(true)} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} md={12}>
                <Field data-automation-id="input-update-profile-title" name="title" component={RadioGroup} label="Title">
                  {this.state.title && this.state.title.map((title) =>
                    <radio key={`title_${title.Id}`} value={title.Id} label={title.Name} />
                  )}
                </Field>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-update-profile-firstname" label="First name" name="firstName" type="text" component={Input} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-update-profile-lastname" label="Last name" name="lastName" type="text" component={Input} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} md={6}>
                <Field
                  data-automation-id="input-update-profile-dateofbirth"
                  label="Date of birth"
                  name="dateOfBirth"
                  component={InputDateMonthYear}
                />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-update-profile-contactnumber" label="Contact number" name="contactNumber" component={Input} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} className={styles.buttons}>
                <Button data-automation-id="btn-update-profile-submit" type="submit">Save</Button>
                <Button
                  data-automation-id="btn-update-profile-cancel"
                  type="button"
                  btnStyle="negative"
                  onClick={() => this.onClickCancel()}
                >Cancel</Button>
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

UpdateProfile.propTypes = {
  initialize: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'UpdateProfile',
  validate: updateprofileValidate,
})(UpdateProfile);
