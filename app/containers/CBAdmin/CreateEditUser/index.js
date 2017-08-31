import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, reset } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Input from '../../../components/Input';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';
import Loading from '../../../components/Loading';
import styles from './styles.css';
import message from '../../../Message';
import validate from '../../../utils/validate';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import SuccessPopup from '../../../components/SuccessPopup';
import ErrorPopup from '../../../components/ErrorPopup';

export const userFormValidate = (values) => {
  const errors = {};

  const requiredFields = {
    Role: 'Please choose the role',
  };

  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
  }

  if (!values.get('Email')) {
    errors.Email = 'Please enter email address';
  } else if (values.get('Email')) {
    const isValidLength = validate.isValidLength(values.get('Email'), 100, 'Email address');
    const isEmail = validate.isEmail(values.get('Email'));
    if (isValidLength !== true && !isEmail) {
      errors.Email = `${isValidLength}.  ${message.error.NOT_VALID_EMAIL}.`;
    } else if (isValidLength !== true) {
      errors.Email = isValidLength;
    } else if (!isEmail) {
      errors.Email = message.error.NOT_VALID_EMAIL;
    }
  }

  return errors;
};

export class CreateEditUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: false,
      submitMessage: '',
      pageFunction: 'Create',
      IsActive: false,
      UserPopupShow: false,
      ErrorPopupShow: false,
      Roles: [],
    };
  }

  componentDidMount() {
    const self = this;
    const query = this.props.location.query;
    request.get(`${apiUrl}/CyberaRole`, {}, (response) => {
      if (response.data) {
        self.setState({ Roles: response.data.Items }, () => {
          if (query.RoleName) {
            self.setState({
              pageFunction: 'Edit',
              IsActive: query.Status === 'true' }, () => {
              self.handleInitialize(query.StaffEmail);
            });
          }
        });
      }
    });
  }

  handleInitialize(data) {
    let roleId = 0;
    this.state.Roles.forEach((value) => {
      if (value.Name === this.props.location.query.RoleName) {
        roleId = parseInt(value.Id, 10);
      }
    });
    const initData = {
      Email: data,
      Role: roleId,
    };
    this.props.initialize(initData);
  }

  submit(values) {
    this.setState({ loading: true });
    if (this.state.pageFunction === 'Create') {
      const createBodyParams = {
        Email: values.get('Email'),
        RoleId: values.get('Role'),
      };
      request.post(
        `${apiUrl}/Users/Cybera/InvitationEmail`,
        createBodyParams,
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: `Invitation sent to ${createBodyParams.Email}`,
              UserPopupShow: true,
              loading: false,
            });
            this.props.dispatch(reset('CreateEditUser'));
          } else {
            this.setState({
              ErrorPopupShow: true,
              loading: false,
              submitMessage: response.error,
            });
          }
        }
      );
    } else if (this.state.pageFunction === 'Edit') {
      const createBodyParams = {
        Id: this.props.location.query.StaffId,
        RoleId: values.get('Role'),
        IsActive: this.state.IsActive,
      };
      request.put(
        `${apiUrl}/Users/Staff/Cybera`,
        createBodyParams,
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'User details updated',
              UserPopupShow: true,
              loading: false,
            });
          } else {
            this.setState({
              ErrorPopupShow: true,
              loading: false,
              submitMessage: response.error,
            });
          }
        }
      );
    }
  }

  ToggleStatus() {
    if (this.state.IsActive) {
      this.setState({ IsActive: false });
    } else {
      this.setState({ IsActive: true });
    }
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-cyberauser-link" key="Cybera User" onClick={() => this.props.history.push('/CBAdmin/CyberaUser')}>Cybera User</button>,
      <button data-automation-id="btn-cyberauser-link" key="Users" onClick={() => this.props.history.push('/CBAdmin/CyberaUser')}>User</button>,
      <button data-automation-id="btn-add-edit-cyberauser-link" key="ADD_EDIT" onClick={() => window.location.reload()}>{(this.state.pageFunction === 'Create') ? 'Create New User' : 'Edit User'}</button>,
    ];
    const { handleSubmit } = this.props;
    const popup = [];

    if (this.state.UserPopupShow) {
      popup.push(
        <SuccessPopup
          key="UserPopupShow"
          data-automation-id="popup-cyberauser-create-edit-success"
          onClose={() => {
            this.setState({ UserPopupShow: false });
            this.props.history.push('/CBAdmin/CyberaUser');
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
          data-automation-id="error-popup-cyberauser-create-edit-fail"
          error={this.state.submitMessage}
          key="ErrorPopupShow"
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    const roleMenuItem = [];
    this.state.Roles.forEach((n) => {
      if (n.IsActive) {
        roleMenuItem.push(<MenuItem key={`role_${n.Id}`} value={parseInt(n.Id, 10)} primaryText={n.Name} />);
      }
    });

    return (
      <Layout data-automation-id="page-cyberauser-create-edit">
        <BreadCrumb data-automation-id="breadCrumb-cyberauser-create-edit" breadCrumb={breadCrumb} />
        <h1>{(this.state.pageFunction === 'Create') ? 'Create New User' : 'Edit User'}</h1>
        <Box>
          <form data-automation-id="form-cyberauser-create-edit" onSubmit={handleSubmit((values) => this.submit(values))}>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Field data-automation-id="input-cyberauser-create-edit-email" label="Email" name="Email" type="text" disabled={this.state.pageFunction === 'Edit'} component={Input} />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Field
                  data-automation-id="input-cyberauser-create-edit-role"
                  label="Role"
                  name="Role"
                  component={Select}
                >
                  {roleMenuItem}
                </Field>
              </Col>
              <Col xs={12} sm={2} md={2}>
                {(this.state.pageFunction === 'Edit') ?
                  <div className={styles.statusContainer}>
                    <label htmlFor="Status">Status</label>
                    <Toggle data-automation-id="toggle-cyberauser-create-edit-status" onClick={() => this.ToggleStatus()} defaultToggled={this.state.IsActive} />
                  </div>
                : null }
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className={styles.buttonFooter} >
                  <Button data-automation-id="btn-cyberauser-create-edit-submit" type="submit">Save</Button>
                  <Button data-automation-id="btn-cyberauser-create-edit-cancel" type="button" btnStyle="negative" onClick={() => this.props.history.push('/CBAdmin/CyberaUser')}>Cancel</Button>
                </div>
              </Col>
            </Row>
          </form>
          {popup}
        </Box>
        { this.state.loading && <Loading /> }
      </Layout>);
  }
}

CreateEditUser.propTypes = {
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({ // eslint-disable-line
  form: 'CreateEditUser',
  validate: userFormValidate,
})(CreateEditUser);
