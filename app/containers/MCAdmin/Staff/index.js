import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import EditIcon from 'react-icons/lib/md/edit';
import DeleteIcon from 'react-icons/lib/md/delete';
import PlusIcon from 'react-icons/lib/fa/plus';

import Layout from '../Layout';
import Loading from '../../../components/Loading';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Table from '../../../../app/components/Table';
import { apiUrl } from '../../../config';
import styles from './styles.css';
import ErrorPopup from '../../../components/ErrorPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import { formatDate } from '../../../utils';
import auth from '../../../utils/auth';
import request from '../../../utils/request';
import Button from '../../../components/Button';
import Tap from '../../../components/Tap';

export class Staff extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: false,
      activeTap: (props.location.query.ActiveTap) ? props.location.query.ActiveTap : 'staff',
      sourceName: 'Staff',
      websiteId: '',
      filter: [],
      RolePopupShow: false,
      ErrorPopupShow: false,
      submitMessage: '',
      pageForceReloadCount: 0,
    };
  }

  componentDidMount() {
    let websiteRoles = {};
    let websiteName = '';
    let websiteId = '';
    auth.getUser((User) => {
      websiteRoles = User.WebsiteRoles;
    });
    auth.getWebsite((Website) => {
      websiteName = Website.WebsiteName;
    });
    websiteRoles.forEach((value) => {
      if (value.WebsiteName === websiteName) {
        websiteId = value.WebsiteId;
        this.setState({ websiteId });
      }
    });
  }

  DeleteRole(websiteId, roleId) {
    this.setState({ loading: true }, () => {
      request.delete(
        `${apiUrl}/Websites/${websiteId}/Role/${roleId}`,
        {},
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Selected role deleted successfully',
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

  DeleteStaff(websiteId, staffId) {
    this.setState({ loading: true }, () => {
      request.delete(
        `${apiUrl}/Users/Staff/${staffId}/Websites/${websiteId}`,
        {},
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Selected user deleted successfully',
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

  DeletePendingInvitation(invitationId, websiteId) {
    this.setState({ loading: true }, () => {
      request.delete(
        `${apiUrl}/Users/PendingInvitation/${invitationId}/Websites/${websiteId}`,
        {},
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Selected invitation deleted successfully',
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

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-merchantsettings-link" key="Settings" onClick={() => this.props.history.push('/MCAdmin/PlanManagement')}>Settings</button>,
      <button data-automation-id="btn-merchant-usermanagement-link" key="Users & Roles" onClick={() => window.location.reload()}>Staff</button>,
    ];
    const header = [
      { Label: 'User', Name: 'User', className: styles.name, align: 'center' },
      { Label: 'Role', Name: 'Role', align: 'center' },
      { Label: 'Status', Name: 'Status', align: 'center' },
      { Label: 'Last Signed In Date', Name: 'LastSignedInDate', align: 'center' },
      { Label: 'LastSignedInDate', Name: 'Hide', align: 'center' },
      { Label: 'Created Date', Name: 'CreatedDate', align: 'center' },
      { Label: 'CreatedDate', Name: 'Hide', align: 'center' },
      { Label: 'SortDisable', Name: 'SortDisable', align: 'center' },
    ];

    const body = [
      (value) => `${value.FirstName} ${value.LastName}`,
      (value) => (value.WebsiteRoles[0] && value.WebsiteRoles[0].RoleName),
      (value) => (value.WebsiteRoles[0] && (value.WebsiteRoles[0].IsActive ? 'Activate' : 'Deactivate')),
      (value) => (value.WebsiteRoles[0] && (value.WebsiteRoles[0].LastSignInDate ? formatDate(value.WebsiteRoles[0].LastSignInDate) : '')),
      (value) => (value.WebsiteRoles[0] && value.WebsiteRoles[0].LastSignInDate),
      (value) => (value.WebsiteRoles[0] && (value.WebsiteRoles[0].StaffCreatedDate ? formatDate(value.WebsiteRoles[0].StaffCreatedDate) : '')),
      (value) => (value.WebsiteRoles[0] && value.WebsiteRoles[0].StaffCreatedDate),
      (value) => [<Link
        key="EditIcon"
        style={{ textDecoration: 'none' }}
        to={{
          pathname: '/MCAdmin/Staff/CreateEditStaff',
          search: `?WebsiteId=${this.state.websiteId}&StaffId=${value.Id}&RoleId=${(value.WebsiteRoles[0] && value.WebsiteRoles[0].RoleId)}&StaffEmail=${value.Email}&Status=${(value.WebsiteRoles[0] && value.WebsiteRoles[0].IsActive)}`,
        }}
      >
        <EditIcon />
      </Link>,
        <button
          key="DeleteIcon"
          style={{ textDecoration: 'none', marginLeft: '10px' }}
          onClick={() => this.DeleteStaff(this.state.websiteId, value.Id)}
        >
          <DeleteIcon />
        </button>],
    ];

    const downloadbody = [
      (value) => value.User,
      (value) => value.Role,
      (value) => value.Status,
      (value) => value['Last Signed In Date'],
      (value) => value['Created Date'],
    ];

    const pendingInvitationheader = [
      { Label: 'Email', Name: 'Email', align: 'center' },
      { Label: 'Role', Name: 'Role', align: 'center' },
      { Label: 'Sent Date', Name: 'SentDate', align: 'center' },
      { Label: 'SentDate', Name: 'Hide', align: 'center' },
      { Label: 'SortDisable', Name: 'SortDisable', align: 'center' },
    ];

    const pendingInvitationbody = [
      (value) => value.Email,
      (value) => value.Role,
      (value) => (value.CreatedDate ? formatDate(value.CreatedDate) : ''),
      (value) => value.CreatedDate,
      (value) => <button
        key="DeleteIcon"
        style={{ textDecoration: 'none' }}
        onClick={() => this.DeletePendingInvitation(value.Id, this.state.websiteId)}
      >
        <DeleteIcon />
      </button>,
    ];

    const pendingInvitationDownloadbody = [
      (value) => value.Email,
      (value) => value.Role,
      (value) => value['Sent Date'],
    ];


    const headerRole = [
      { Label: 'Role Name', Name: 'Role Name', className: styles.name, align: 'center' },
      { Label: 'Status', Name: 'Status', align: 'center' },
      { Label: 'Created Date', Name: 'CreatedDate', align: 'center' },
      { Label: 'CreatedDate', Name: 'Hide', align: 'center' },
      { Label: 'SortDisable', Name: 'SortDisable', align: 'center' },
    ];

    const bodyRole = [
      (value) => value.Name,
      (value) => (value.IsActive ? 'Activate' : 'Deactivate'),
      (value) => (value.CreatedDate ? formatDate(value.CreatedDate) : ''),
      (value) => value.CreatedDate,
      (value) => [(value.Name !== 'Administrator' &&
      <Link
        key="EditIcon"
        style={{ textDecoration: 'none' }}
        to={{
          pathname: '/MCAdmin/Staff/CreateEditRole',
          search: `?WebsiteId=${this.state.websiteId}&RoleId=${value.Id}`,
        }}
      >
        <EditIcon />
      </Link>),
      (value.Name !== 'Administrator' &&
      <button
        key="DeleteIcon"
        style={{ textDecoration: 'none', marginLeft: '10px' }}
        onClick={() => this.DeleteRole(this.state.websiteId, value.Id)}
      >
        <DeleteIcon />
      </button>)],
    ];

    const downloadbodyRole = [
      (value) => value['Role Name'],
      (value) => value.Status,
      (value) => value['Created Date'],
    ];

    const popup = [];
    if (this.state.RolePopupShow) {
      popup.push(
        <SuccessPopup
          key="RolePopupShow"
          data-automation-id="popup-merchant-usermanagement-success"
          onClose={() => {
            this.setState({ RolePopupShow: false }, () => {
              if (this.state.submitMessage === 'Selected user deleted successfully') {
                window.location = window.location.href.split('?')[0];
              } else {
                this.setState({ pageForceReloadCount: this.state.pageForceReloadCount + 1 });
              }
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
          data-automation-id="error-popup-merchant-usermanagement-fail"
          key="ErrorPopup"
          error={this.state.submitMessage}
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    const tabs = [
      <button key="staff" onClick={() => this.setState({ activeTap: 'staff' })}>User</button>,
      <button key="role" onClick={() => this.setState({ activeTap: 'role' })}>Role</button>,
    ];

    return (
      <Layout data-automation-id="page-merchant-usermanagement">
        <BreadCrumb data-automation-id="breadcrumb-merchant-usermanagement" breadCrumb={breadCrumb} />
        <h2>Staff</h2>
        <Box className={styles.box}>
          <Tap tabs={tabs} active={this.state.activeTap} />
          { this.state.activeTap === 'staff' &&
            <div className={styles.container}>
              <Row>
                <Col xs={12} sm={6} md={4} lg={4}>
                  <Button
                    data-automation-id="btn-add-new-merchantuser"
                    onClick={() => this.props.history.push({
                      pathname: '/MCAdmin/Staff/CreateEditStaff',
                      search: `?WebsiteId=${this.state.websiteId}`,
                    })}
                  ><PlusIcon /> Create new user</Button>
                </Col>
              </Row>
              <Table
                data-automation-id="table-merchantuser"
                dataSource={`User/Websites/${this.state.websiteId}/Merchant`}
                header={header}
                body={body}
                downloadBody={downloadbody}
                filter={this.state.filter}
                fileName="Staff"
              />
            </div>
          }
          { this.state.activeTap === 'role' &&
            <div className={styles.container}>
              <Row>
                <Col xs={12} sm={6} md={4} lg={4}>
                  <Button
                    data-automation-id="btn-add-new-merchantrole"
                    onClick={() => this.props.history.push({
                      pathname: '/MCAdmin/Staff/CreateEditRole',
                      search: `?WebsiteId=${this.state.websiteId}`,
                    })}
                  ><PlusIcon /> Create new role</Button>
                </Col>
              </Row>
              <Table
                data-automation-id="table-merchantrole"
                dataSource={`Websites/${this.state.websiteId}/Role`}
                header={headerRole}
                body={bodyRole}
                downloadBody={downloadbodyRole}
                filter={this.state.filter}
                pageForceReload={this.state.pageForceReloadCount}
                fileName="Roles"
              />
            </div>
          }
        </Box>
        { this.state.activeTap === 'staff' &&
          <div>
            <h2>Pending Invitations</h2>
            <Box>
              <Table
                data-automation-id="table-pending-merchantuser"
                dataSource={`Users/PendingInvitation/Websites/${this.state.websiteId}`}
                header={pendingInvitationheader}
                body={pendingInvitationbody}
                downloadBody={pendingInvitationDownloadbody}
                filter={[]}
                pageForceReload={this.state.pageForceReloadCount}
                fileName="Cybera User Pending Invitations"
              />
            </Box>
          </div>
        }
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-merchant-usermanagement"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
        { popup }
        { this.state.loading && <Loading da-automation-id="loading-staff" /> }
      </Layout>);
  }
}

Staff.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Staff;
