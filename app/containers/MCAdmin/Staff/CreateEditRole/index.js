import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, reset } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import Toggle from 'material-ui/Toggle';

import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Input from '../../../../components/Input';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import Loading from '../../../../components/Loading';
import styles from './styles.css';
import Button from '../../../../components/Button';
import CheckBox from '../../../../components/CheckBox';
import ErrorPopup from '../../../../components/ErrorPopup';
import SuccessPopup from '../../../../components/SuccessPopup';
import validate from '../../../../utils/validate';

export const RoleFormValidate = (values) => {
  const errors = {};

  if (!values.get('RoleName')) {
    errors.RoleName = 'Please enter role name';
  } else if (values.get('RoleName')) {
    const isValidLength = validate.isValidLength(values.get('RoleName'), 50, 'Role name');
    const isRoleName = validate.isRoleName(values.get('RoleName'));
    if (isValidLength !== true && isRoleName !== true) {
      errors.RoleName = `${isValidLength}.  ${isRoleName}.`;
    } else if (isValidLength !== true) {
      errors.RoleName = isValidLength;
    } else if (isRoleName !== true) {
      errors.RoleName = isRoleName;
    }
  }

  return errors;
};

export class CreateEditRole extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      websiteId: props.location.query.WebsiteId,
      submitMessage: '',
      pageFunction: 'Create',
      IsActive: false,
      RolePopupShow: false,
      ErrorPopupShow: false,
      CheckBoxStatus: [],
      CheckBoxMessage: '',
      PermissionNames: [],
      PermissionKeys: [],
      existRoles: [],
      currentRoleName: '',
    };
  }

  componentDidMount() {
    const self = this;
    const query = this.props.location.query;
    let CheckBoxStatus = [];
    request.get(`${apiUrl}/AllPermission`, {}, (response) => {
      if (response.data) {
        CheckBoxStatus = response.data.map(() => false);
        self.setState({
          PermissionNames: response.data.map((permission) => permission.Name),
          PermissionKeys: response.data.map((permission) => permission.Key),
          CheckBoxStatus: response.data.map(() => false),
        }, () => {
          if (query.RoleId) {
            request.get(`${apiUrl}/Websites/${query.WebsiteId}/Role?$filter=Id eq ${query.RoleId}`, {}, (response1) => {
              if (response1.data) {
                self.handleInitialize(response1.data.Items[0]);
                response1.data.Items[0].Permissions.forEach((value) => {
                  let KeyCount = 0;
                  this.state.PermissionKeys.forEach((KeyName) => {
                    if (value.Key === KeyName) {
                      CheckBoxStatus[KeyCount] = true;
                    }
                    KeyCount += 1;
                  });
                });
                self.setState({ loading: false,
                  pageFunction: 'Edit',
                  IsActive: response1.data.Items[0].IsActive,
                  CheckBoxStatus,
                  currentRoleName: response1.data.Items[0].Name,
                });
              }
            });
          } else {
            self.setState({
              loading: false,
              pageFunction: 'Create',
            });
          }
        });
      }
    });
    request.get(`${apiUrl}/Websites/${query.WebsiteId}/Role`, {}, (response) => {
      if (response.data) {
        self.setState({ existRoles: response.data.Items });
      }
    });
  }

  handleInitialize(data) {
    const initData = {
      RoleName: (data.Name) ? data.Name : '',
    };
    this.props.initialize(initData);
  }

  CheckPermissionSelected() {
    let PermissionsNotSelected = false;
    let notSelectedNum = 0;
    this.state.CheckBoxStatus.forEach((value) => {
      if (!value) {
        notSelectedNum += 1;
      }
    });
    if (notSelectedNum === this.state.CheckBoxStatus.length) {
      PermissionsNotSelected = true;
      this.setState({ CheckBoxMessage: 'Please choose permission level' });
    } else {
      PermissionsNotSelected = false;
    }
    return PermissionsNotSelected;
  }

  submit(values) {
    const permissionUnChecked = this.CheckPermissionSelected();
    const permissionKey = [];
    let CheckBoxStatusCount = 0;
    this.state.CheckBoxStatus.forEach((value) => {
      if (value) {
        permissionKey.push(this.state.PermissionKeys[CheckBoxStatusCount].toString());
      }
      CheckBoxStatusCount += 1;
    });

    if (permissionUnChecked) {
      this.setState({ CheckBoxMessage: 'Please choose permission level' });
    } else if (this.state.pageFunction === 'Create') {
      let roleNameExist = false;
      const roleNameSubmit = values.get('RoleName').toLowerCase();
      if (this.props.location.query.RoleId) {
        this.state.existRoles.forEach((value) => {
          if (roleNameSubmit === value.Name.toLowerCase() && roleNameSubmit !== this.state.currentRoleName.toLowerCase()) {
            roleNameExist = true;
            this.setState({
              ErrorPopupShow: true,
              submitMessage: 'This role name already exists',
            });
          }
        });
      } else {
        this.state.existRoles.forEach((value) => {
          if (value.Name.toLowerCase() === roleNameSubmit) {
            roleNameExist = true;
            this.setState({
              ErrorPopupShow: true,
              submitMessage: 'This role name already exists',
            });
          }
        });
      }

      if (!roleNameExist) {
        const createBodyParams = {
          Name: values.get('RoleName'),
          PermissionsKey: permissionKey,
        };
        this.setState({ loading: true }, () => {
          request.post(
            `${apiUrl}/Websites/${this.state.websiteId}/Role`,
            createBodyParams,
            (response) => {
              if (!response.error) {
                this.setState({
                  submitMessage: 'New role created',
                  RolePopupShow: true,
                  loading: false,
                });
                this.props.dispatch(reset('CreateEditRole'));
                const clearCheckBoxes = this.state.CheckBoxStatus.map(() => false);
                this.setState({ CheckBoxStatus: clearCheckBoxes });
              } else {
                this.setState({
                  ErrorPopupShow: true,
                  loading: false,
                  submitMessage: response.error,
                });
              }
            }
          );
        });
      }
    } else if (this.state.pageFunction === 'Edit') {
      let roleNameExist = false;
      const roleNameSubmit = values.get('RoleName').toLowerCase();
      if (this.props.location.query.RoleId) {
        this.state.existRoles.forEach((value) => {
          if (roleNameSubmit === value.Name.toLowerCase() && roleNameSubmit !== this.state.currentRoleName.toLowerCase()) {
            roleNameExist = true;
            this.setState({
              ErrorPopupShow: true,
              submitMessage: 'This role name already exists',
            });
          }
        });
      } else {
        this.state.existRoles.forEach((value) => {
          if (value.Name.toLowerCase() === roleNameSubmit) {
            roleNameExist = true;
            this.setState({
              ErrorPopupShow: true,
              submitMessage: 'This role name already exists',
            });
          }
        });
      }

      if (!roleNameExist) {
        const createBodyParams = {
          IsActive: this.state.IsActive,
          Name: values.get('RoleName'),
          PermissionsKey: permissionKey,
        };
        this.setState({ loading: true }, () => {
          request.put(
            `${apiUrl}/Websites/${this.state.websiteId}/Role/${this.props.location.query.RoleId}`,
            createBodyParams,
            (response) => {
              if (!response.error) {
                this.setState({
                  submitMessage: 'Role has been updated',
                  RolePopupShow: true,
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
        });
      }
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

    if (this.state.RolePopupShow) {
      popup.push(
        <SuccessPopup
          key="RolePopupShow"
          data-automation-id="popup-merchantrole-create-edit-success"
          onClose={() => {
            this.setState({ RolePopupShow: false });
            this.props.history.push({
              pathname: '/MCAdmin/Staff',
              search: 'ActiveTap=role',
            });
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
          data-automation-id="error-popup-merchantrole-create-edit-fail"
          key="ErrorPopup"
          error={this.state.submitMessage}
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-merchantrole-create-edit">
        <BreadCrumb
          data-automation-id="breadCrumb-merchantrole-create-edit"
          breadCrumb={[
            <button data-automation-id="btn-merchantsettings-link" key="Settings" onClick={() => this.props.history.push('/MCAdmin/PlanManagement')}>Settings</button>,
            <button data-automation-id="btn-merchant-usermanagement-link" key="Users & Roles" onClick={() => this.props.history.push('/MCAdmin/Staff')}>Staff</button>,
            <button data-automation-id="btn-merchantrole-create-edit-link" key="ADD_EDIT" onClick={() => window.location.reload()}>{(this.state.pageFunction === 'Create') ? 'Create New Role' : 'Edit Role'}</button>,
          ]}
        />
        <h2>{(this.state.pageFunction === 'Create') ? 'Create New Role' : 'Edit Role'}</h2>
        <Box>
          <form data-automation-id="form-merchantrole-create-edit" onSubmit={handleSubmit((values) => this.submit(values))}>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-merchantrole-create-edit-name" label="Role Name" name="RoleName" type="text" component={Input} />
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={3}>
                <div className={styles.perMission}>Permission</div>
              </Col>
            </Row>
            <Row>
              {this.state.PermissionNames.map((PermissionName, index) =>
                <Col key={`col_${PermissionName}`} xs={6} md={3}>
                  <Field
                    data-automation-id="input-merchantrole-create-edit-role"
                    label={PermissionName}
                    key={PermissionName}
                    name={PermissionName}
                    component={CheckBox}
                    checked={this.state.CheckBoxStatus[index]}
                    onCheck={(value) => {
                      const CheckBoxStatus = this.state.CheckBoxStatus;
                      CheckBoxStatus[index] = value;
                      this.setState({ CheckBoxStatus,
                        CheckBoxMessage: '',
                      });
                    }}
                  />
                </Col>
              )}
            </Row>
            <div className={styles.checkBoxMessage}>{this.state.CheckBoxMessage}</div>
            <Row>
              <Col xs={12} md={6}>
                {(this.state.pageFunction === 'Edit') ?
                  <div className={styles.statusContainer}>
                    <label htmlFor="Status">Status</label>
                    <Toggle data-automation-id="toggle-merchantrole-create-edit-status" onClick={() => this.ToggleStatus()} defaultToggled={this.state.IsActive} />
                  </div>
                : null }
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className={styles.buttonFooter} >
                  <Button
                    data-automation-id="btn-merchantrole-create-edit-submit" type="submit"
                    onClick={() => this.CheckPermissionSelected()}
                  >Save</Button>
                  <Button
                    data-automation-id="btn-merchantrole-create-edit-cancel"
                    type="button"
                    btnStyle="negative"
                    onClick={() => this.props.history.push({
                      pathname: '/MCAdmin/Staff',
                      search: '?ActiveTap=role',
                    })}
                  >Cancel</Button>
                </div>
              </Col>
            </Row>
          </form>
        </Box>
        { popup }
        { this.state.loading && <Loading data-automation-id={`loading-role-${this.state.pageFunction.toLocaleLowerCase()}`} /> }
      </Layout>);
  }
}

CreateEditRole.propTypes = {
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'CreateEditRole',
  validate: RoleFormValidate,
})(CreateEditRole);
