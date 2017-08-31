import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, reset } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';

import Layout from '../../Layout';
import Loading from '../../../../components/Loading';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Input from '../../../../components/Input';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import styles from './styles.css';
import message from '../../../../Message';
import validate from '../../../../utils/validate';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import ErrorPopup from '../../../../components/ErrorPopup';
import SuccessPopup from '../../../../components/SuccessPopup';

export const staffFormValidate = (values) => {
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

export class CreateEditStaff extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: false,
      websiteId: props.location.query.WebsiteId,
      submitMessage: '',
      pageFunction: 'Create',
      IsActive: false,
      StaffPopupShow: false,
      ErrorPopupShow: false,
      Roles: [],
    };
  }

  componentDidMount() {
    const self = this;
    const query = this.props.location.query;
    request.get(`${apiUrl}/Websites/${query.WebsiteId}/Role`, {}, (response) => {
      if (response.data) {
        self.setState({
          websiteId: query.WebsiteId,
          Roles: response.data.Items,
        });
      }
    });
    if (query.StaffId) {
      self.setState({
        pageFunction: 'Edit',
        IsActive: query.Status === 'true' }, () => {
        self.handleInitialize(query.StaffEmail);
      });
    }
  }

  handleInitialize(data) {
    const initData = {
      Email: data,
      Role: parseInt(this.props.location.query.RoleId, 10),
    };
    this.props.initialize(initData);
  }

  submit(values) {
    if (this.state.pageFunction === 'Create') {
      this.setState({ loading: true }, () => {
        const createBodyParams = {
          Email: values.get('Email'),
          RoleId: values.get('Role'),
        };
        request.post(
          `${apiUrl}/Users/Staff/InvitationEmail/Websites/${this.state.websiteId}`,
          createBodyParams,
          (response) => {
            if (!response.error) {
              this.setState({
                submitMessage: `Invitation sent to ${createBodyParams.Email}`,
                StaffPopupShow: true,
                loading: false,
              });
              this.props.dispatch(reset('CreateEditStaff'));
            } else {
              this.setState({
                ErrorPopupShow: true,
                submitMessage: response.error,
                loading: false,
              });
            }
          }
        );
      });
    } else if (this.state.pageFunction === 'Edit') {
      this.setState({ loading: true }, () => {
        const createBodyParams = {
          Id: this.props.location.query.StaffId,
          RoleId: values.get('Role'),
          IsActive: this.state.IsActive,
        };
        request.put(
          `${apiUrl}/Users/Staff/Websites/${this.state.websiteId}`,
          createBodyParams,
          (response) => {
            if (!response.error) {
              this.setState({
                submitMessage: 'User details updated',
                StaffPopupShow: true,
                loading: false,
              });
            } else {
              this.setState({
                ErrorPopupShow: true,
                submitMessage: response.error,
                loading: false,
              });
            }
          }
        );
      });
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
    const { handleSubmit } = this.props;
    const popup = [];

    if (this.state.StaffPopupShow) {
      popup.push(
        <SuccessPopup
          data-automation-id="popup-merchantuser-create-edit-success"
          key="StaffPopupShow"
          onClose={() => {
            this.setState({ StaffPopupShow: false });
            this.props.history.push('/MCAdmin/Staff');
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
          data-automation-id="error-popup-merchantuser-create-edit-fail"
          key="ErrorPopup"
          error={this.state.submitMessage}
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
      <Layout data-automation-id="page-merchantuser-create-edit" isLoading={this.state.loading}>
        <BreadCrumb
          data-automation-id="breadCrumb-merchantuser-create-edit"
          breadCrumb={[
            <button data-automation-id="btn-merchantsettings-link" key="Settings" onClick={() => this.props.history.push('/MCAdmin/PlanManagement')}>Settings</button>,
            <button data-automation-id="btn-merchant-usermanagement-link" key="Users & Roles" onClick={() => this.props.history.push('/MCAdmin/Staff')}>Staff</button>,
            <button data-automation-id="btn-merchantuser-create-edit-link" key="ADD_EDIT" onClick={() => window.location.reload()}>{(this.state.pageFunction === 'Create') ? 'Create New User' : 'Edit User'}</button>,
          ]}
        />
        <h2>{(this.state.pageFunction === 'Create') ? 'Create New User' : 'Edit User'}</h2>
        <Box>
          <form data-automation-id="form-merchantuser-create-edit" onSubmit={handleSubmit((values) => this.submit(values))}>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Field data-automation-id="input-merchantuser-create-edit-email" label="Email" name="Email" type="text" disabled={this.state.pageFunction === 'Edit'} component={Input} />
              </Col>
              <Col xs={12} sm={4} md={4}>
                <Field
                  data-automation-id="input-merchantuser-create-edit-role"
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
                    <Toggle data-automation-id="toggle-merchantuser-create-edit-status" onClick={() => this.ToggleStatus()} defaultToggled={this.state.IsActive} />
                  </div>
                : null }
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className={styles.buttonFooter} >
                  <Button data-automation-id="btn-merchantuser-create-edit-submit" type="submit">Save</Button>
                  <Button data-automation-id="btn-merchantuser-create-edit-cancel" type="button" btnStyle="negative" onClick={() => this.props.history.push('/MCAdmin/Staff')}>Cancel</Button>
                </div>
              </Col>
            </Row>
          </form>
          { popup }
        </Box>
        { this.state.loading && <Loading data-automation-id={`loading-staff-${this.state.pageFunction.toLocaleLowerCase()}`} /> }
      </Layout>);
  }
}

CreateEditStaff.propTypes = {
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({ // eslint-disable-line
  form: 'CreateEditStaff',
  validate: staffFormValidate,
})(CreateEditStaff);
