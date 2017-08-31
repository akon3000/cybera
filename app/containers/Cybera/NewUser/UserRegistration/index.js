import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import IconClose from 'react-icons/lib/md/close';
import styles from './styles.css';
import Input from '../../../../components/Input';
import CheckBox from '../../../../components/CheckBox';
import RadioGroup from '../../../../components/RadioGroup';
import Message from '../../../../Message';
import validate from '../../../../utils/validate';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import { stringToDate } from '../../../../utils';
import Button from '../../../../components/Button';
import DialogCustom from '../../../../components/Dialog';
import InputDateMonthYear from '../../../../components/InputDateMonthYear';
import auth from '../../../../utils/auth';
import ErrorPopup from '../../../../components/ErrorPopup';

export const UserRegistrationValidate = (values) => {
  const errors = {};

  const requiredFields = {
    title: 'Please select title',
    firstName: 'Please enter first name',
    lastName: 'Please enter last name',
    phoneNumber: 'Please enter contact number',
    dateOfBirth: 'Please enter date of birth',
  };

  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
  }

  if (!values.get('password')) {
    errors.password = 'Please enter password';
  } else if (!validate.isPassword(values.get('password'))) {
    errors.password = Message.error.PASSWORD_INCORRECT_FORMAT;
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

  if (values.get('phoneNumber')) {
    const isValidLength = validate.isValidLength(values.get('phoneNumber'), 14, 'Contact number');
    const matchContactNumber = validate.matchContactNumber(values.get('phoneNumber'));
    if (isValidLength !== true && matchContactNumber !== true) {
      errors.phoneNumber = `${isValidLength}.  ${matchContactNumber}.`;
    } else if (isValidLength !== true) {
      errors.phoneNumber = isValidLength;
    } else if (matchContactNumber !== true) {
      errors.phoneNumber = matchContactNumber;
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

  return errors;
};

export class UserRegistrationPopUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageSource: props.pageSource,
      isReceiveCyberaNewsLetter: false,
      NewUserPopupShow: false,
      ErrorPopupShow: false,
      SubmitSuccess: false,
      submitMessage: '',
      emailisExist: false,
      waitMessage: false,
      accessToken: '',
      invitationInvalid: true,
    };
  }

  componentDidMount() {
    const self = this;
    const query = this.props.query;

    if (query.value) {
      self.setState({
        emailisExist: true,
        waitMessage: true,
      }, () => {
        if (this.state.pageSource === 'CyberaNewUser') {
          request.post(
            `${apiUrl}/Users/ExistingStaffWithCyberaRole?key=${query.key}&value=${query.value}&roleId=${query.roleid}`,
            {},
            (response) => {
              if (!response.error) {
                this.setState({
                  submitMessage: 'Congratulations, your account has been created.',
                  NewUserPopupShow: true,
                  SubmitSuccess: true,
                  waitMessage: false,
                  accessToken: response.data.access_token,
                });
              } else {
                this.setState({
                  ErrorPopupShow: true,
                  waitMessage: false,
                  submitMessage: response.error,
                });
              }
            }
          );
        } else if (this.state.pageSource === 'MerchantNewUser') {
          request.post(
            `${apiUrl}/Users/Staff/ExistingStaffWithWebsiteRole?roleId=${query.roleid}&key=${query.key}&value=${query.value}`,
            {},
            (response) => {
              if (!response.error) {
                this.setState({
                  submitMessage: 'Congratulations, your account has been created.',
                  NewUserPopupShow: true,
                  SubmitSuccess: true,
                  waitMessage: false,
                  accessToken: response.data.access_token,
                });
              } else {
                this.setState({
                  ErrorPopupShow: true,
                  waitMessage: false,
                  submitMessage: response.error,
                });
              }
            }
          );
        }
      });
    } else if (this.state.pageSource === 'CyberaNewUser') {
      request.get(`${apiUrl}/Users/Staff/IsCyberaInvitationValid?key=${query.key}`, {},
        (response) => {
          if (response.data) {
            this.setState({ invitationInvalid: false });
          } else {
            this.setState({
              ErrorPopupShow: true,
              submitMessage: response.error,
            });
          }
        }
      );
    } else if (this.state.pageSource === 'MerchantNewUser') {
      request.get(`${apiUrl}/Users/Staff/IsWebsiteInvitationValid?key=${query.key}`, {},
        (response) => {
          if (response.data) {
            this.setState({ invitationInvalid: false });
          } else {
            this.setState({
              ErrorPopupShow: true,
              submitMessage: response.error,
            });
          }
        }
      );
    }
  }

  submit(values) {
    const query = this.props.query;
    const createBodyParams = {
      FirstName: values.get('firstName'),
      LastName: values.get('lastName'),
      PhoneNumber: values.get('phoneNumber'),
      BirthDate: stringToDate(values.get('dateOfBirth')).toUTCString(),
      TitleId: parseInt(values.get('title'), 10),
      Email: query.email,
      Password: values.get('password'),
      IsReceiveCyberaNewsLetter: this.state.isReceiveCyberaNewsLetter,
    };
    if (this.state.pageSource === 'CyberaNewUser') {
      request.post(
        `${apiUrl}/Users/Staff/NewStaffWithCyberaRole?key=${query.key}`,
        createBodyParams,
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Congratulations, your account has been created.',
              NewUserPopupShow: true,
              SubmitSuccess: true,
              accessToken: response.data.access_token,
            });
          } else {
            this.setState({
              ErrorPopupShow: true,
              submitMessage: response.error,
            });
          }
        }
      );
    } else if (this.state.pageSource === 'MerchantNewUser') {
      request.post(
        `${apiUrl}/Users/Staff/NewStaffWithWebsiteRole?key=${query.key}`,
        createBodyParams,
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Congratulations, your account has been created.',
              NewUserPopupShow: true,
              SubmitSuccess: true,
              accessToken: response.data.access_token,
            });
          } else {
            this.setState({
              ErrorPopupShow: true,
              submitMessage: response.error,
            });
          }
        }
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;

    const titleGroup = [];
    titleGroup[0] = <radio key="mr" value="1" label="Mr." />;
    titleGroup[1] = <radio key="mrs" value="2" label="Mrs." />;
    titleGroup[2] = <radio key="ms" value="3" label="Ms." />;
    titleGroup[3] = <radio key="miss" value="4" label="Miss." />;

    return (
      <div>
        {this.state.ErrorPopupShow &&
          <ErrorPopup
            data-automation-id="error-add-invited-user"
            error={this.state.submitMessage}
            onClose={() => { this.setState({ ErrorPopupShow: false }); }}
          />
        }
        {this.state.NewUserPopupShow &&
          <DialogCustom
            data-automation-id="dialog-add-invited-user-success"
            title="You have been successful"
            key="NewUserPopupShow"
            onClose={() => {
              if (this.state.NewUserPopupShow) {
                auth.updateToken(this.state.accessToken, () => {
                  auth.updateClaims(() => {
                    auth.getRole((role) => {
                      if (role.length === 1) {
                        if (role[0] === 'Merchant') {
                          auth.getUser((user) => {
                            if (user.WebsiteRoles && user.WebsiteRoles.length === 1) {
                              request.post(`${apiUrl}/login/Website/${user.WebsiteRoles[0].WebsiteId}`, {}, () => {
                                auth.setWebsiteID(user.WebsiteRoles[0].WebsiteId, () => {
                                  auth.getWebsite(() => {
                                    this.props.history.push('/MCAdmin');
                                  });
                                });
                              });
                            } else {
                              this.props.history.push('/Auth/SwitchAccount');
                            }
                          });
                        } else if (role[0] === 'Cybera') {
                          request.post(`${apiUrl}/login/Cybera`, {}, () => {
                            this.props.history.push('/CBAdmin');
                          });
                        }
                      } else if (role.length === 2) {
                        auth.getUser((user) => {
                          if (user.WebsiteRoles.length === 0) {
                            request.post(`${apiUrl}/login/Cybera`, {}, () => {
                              this.props.history.push('/CBAdmin');
                            });
                          } else if (user.WebsiteRoles.length > 0) {
                            this.props.history.push('/Auth/SwitchAccount');
                          }
                        });
                      }
                    });
                  });
                });
              } else if (this.state.invitationInvalid) {
                this.props.history.push('/');
              }
            }}
            actions={[
              <Button
                data-automation-id="btn-close-add-invited-user"
                onClick={() => {
                  if (this.state.NewUserPopupShow) {
                    auth.updateToken(this.state.accessToken, () => {
                      auth.updateClaims(() => {
                        auth.getRole((role) => {
                          if (role.length === 1) {
                            if (role[0] === 'Merchant') {
                              auth.getUser((user) => {
                                if (user.WebsiteRoles && user.WebsiteRoles.length === 1) {
                                  request.post(`${apiUrl}/login/Website/${user.WebsiteRoles[0].WebsiteId}`, {}, () => {
                                    auth.setWebsiteID(user.WebsiteRoles[0].WebsiteId, () => {
                                      auth.getWebsite(() => {
                                        this.props.history.push('/MCAdmin');
                                      });
                                    });
                                  });
                                } else {
                                  this.props.history.push('/Auth/SwitchAccount');
                                }
                              });
                            } else if (role[0] === 'Cybera') {
                              request.post(`${apiUrl}/login/Cybera`, {}, () => {
                                this.props.history.push('/CBAdmin');
                              });
                            }
                          } else if (role.length === 2) {
                            auth.getUser((user) => {
                              if (user.WebsiteRoles.length === 0) {
                                request.post(`${apiUrl}/login/Cybera`, {}, () => {
                                  this.props.history.push('/CBAdmin');
                                });
                              } else if (user.WebsiteRoles.length > 0) {
                                this.props.history.push('/Auth/SwitchAccount');
                              }
                            });
                          }
                        });
                      });
                    });
                  } else if (this.state.invitationInvalid) {
                    this.props.history.push('/');
                  }
                }}
              >Ok</Button>]}
          >
            <div>{this.state.submitMessage}</div>
          </DialogCustom>
        }
        {(!this.state.NewUserPopupShow && !this.state.ErrorPopupShow && this.state.waitMessage && !this.state.invitationInvalid) &&
          <DialogCustom
            data-automation-id="dialog-addexisting-user-wait"
            title="Personal Information Registering ..."
            key="WaitMessage"
          >
            <div style={{ textAlign: 'center' }}>Please Wait</div>
          </DialogCustom>
        }
        {(!this.state.NewUserPopupShow && !this.state.ErrorPopupShow && !this.state.SubmitSuccess && !this.state.emailisExist && !this.state.invitationInvalid) &&
          <form data-automation-id="form-add-newuser-information" onSubmit={handleSubmit((values) => this.submit(values))}>
            <div className={styles.background}>
              <div className={styles.box}>
                <div key="Popup_Title" className={styles.titleBox}>
                  Personal Information
                  <button data-automation-id="btn-close-add-invited-newuser" className={styles.closeButton} onClick={() => this.props.onClose()} type="button"><IconClose /></button>
                </div>
                <div className={styles.body}>
                  <Row>
                    <Col xs={12} sm={6} md={6}>
                      <Field data-automation-id="input-add-invited-newuser-title" name="title" component={RadioGroup} label="Title">
                        {titleGroup}
                      </Field>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6} md={6}>
                      <Field data-automation-id="input-add-invited-newuser-firstname" label="First Name" name="firstName" type="text" component={Input} />
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                      <Field data-automation-id="input-add-invited-newuser-lastname" label="Last Name" name="lastName" type="text" component={Input} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6} md={6}>
                      <Field data-automation-id="input-add-invited-newuser-phonenumber" label="Contact Number" name="phoneNumber" type="text" component={Input} />
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                      <Field
                        data-automation-id="input-add-invited-newuser-dateofbirth"
                        label="Date of birth"
                        name="dateOfBirth"
                        component={InputDateMonthYear}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6} md={6}>
                      <Field data-automation-id="input-add-invited-newuser-password" label="Password" name="password" type="password" component={Input} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={6} md={6}>
                      <Field
                        data-automation-id="input-add-invited-newuser-suscribetonewsletter"
                        label="I would like to subscribe to Cybera newsletter"
                        name="isReceiveCyberaNewsLetter" type="text" component={CheckBox}
                        checked={this.state.isReceiveCyberaNewsLetter}
                        onCheck={(value) => this.setState({ isReceiveCyberaNewsLetter: value })}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={12} md={12} className={styles.buttonContainer}>
                      <div className={styles.buttonFooter}>
                        <button data-automation-id="btn-add-invited-newuser-submit" type="submit" className={styles.saveButton}>Submit</button>
                        <button
                          data-automation-id="btn-add-invited-newuser-cancel"
                          type="button" className={styles.cancelButton}
                          onClick={() => this.props.history.push('/')}
                        >Cancel</button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </form>
        }
      </div>
    );
  }
}

UserRegistrationPopUp.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  pageSource: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'UserRegistrationPopUp',
  validate: UserRegistrationValidate,
})(UserRegistrationPopUp);
