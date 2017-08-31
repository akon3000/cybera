import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import EditIcon from 'react-icons/lib/md/edit';
import DeleteIcon from 'react-icons/lib/md/delete';
import PlusIcon from 'react-icons/lib/fa/plus';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import { apiUrl } from '../../../config';
import request from '../../../utils/request';
import styles from './styles.css';
import ErrorPopup from '../../../components/ErrorPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import Button from '../../../components/Button';
import { formatDate } from '../../../utils';
import Table from '../../../../app/components/Table';

export class CyberaUser extends Component { // eslint-disable-line

  constructor() {
    super();
    this.state = {
      error: false,
      sourceName: 'CyberaUser',  // for informing Table components to know the source of data
      filter: [],
      UserPopupShow: false,
      InvitationShow: false,
      ErrorPopupShow: false,
      submitMessage: '',
      pageForceReloadCount: 0,
    };
  }

  DeleteStaff(staffId) {
    request.delete(
      `${apiUrl}/Users/Staff/Cybera?StaffId=${staffId}`,
      {},
      (response) => {
        if (!response.error) {
          this.setState({
            submitMessage: 'User deleted successfully',
            UserPopupShow: true,
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

  DeletePendingInvitation(invitationId) {
    request.delete(
      `${apiUrl}/Users/PendingInvitation/${invitationId}/Websites/0`,
      {},
      (response) => {
        if (!response.error) {
          this.setState({
            submitMessage: 'Selected invitation deleted successfully',
            InvitationShow: true,
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

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-cyberauser-link" key="Cybera User" onClick={() => window.location.reload()}>Cybera User</button>,
      <button data-automation-id="btn-cyberauser-link" key="Users" onClick={() => window.location.reload()}>User</button>,
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
      (value) => value.CyberaRoleName,
      (value) => (value.IsCyberaRoleActive ? 'Activate' : 'Deactivate'),
      (value) => (value.LastCyberaSignInDate ? formatDate(value.LastCyberaSignInDate) : ''),
      (value) => value.LastCyberaSignInDate,
      (value) => (value.CyberaCreatedDate ? formatDate(value.CyberaCreatedDate) : ''),
      (value) => value.CyberaCreatedDate,
      (value) => [<button
        key="EditIcon"
        onClick={() => this.props.history.push({
          pathname: '/CBAdmin/CreateEditUser',
          search: `?StaffId=${value.Id}&RoleName=${value.CyberaRoleName}&StaffEmail=${value.Email}&Status=${value.IsCyberaRoleActive}`,
        })}
      ><EditIcon /></button>,
        <button
          key="DeleteIcon"
          style={{ textDecoration: 'none', marginLeft: '10px' }}
          onClick={() => this.DeleteStaff(value.Id)}
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
        onClick={() => this.DeletePendingInvitation(value.Id)}
      >
        <DeleteIcon />
      </button>,
    ];

    const pendingInvitationDownloadbody = [
      (value) => value.Email,
      (value) => value.Role,
      (value) => value['Sent Date'],
    ];

    const popup = [];
    if (this.state.UserPopupShow || this.state.InvitationShow) {
      popup.push(
        <SuccessPopup
          key="UserPopupShow"
          data-automation-id="popup-cyberauser-success"
          onClose={() => {
            this.setState({ UserPopupShow: false, InvitationShow: false });
            if (this.state.UserPopupShow) window.location = window.location.href.split('?')[0];
            if (this.state.InvitationShow) this.setState({ pageForceReloadCount: this.state.pageForceReloadCount + 1 });
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
          data-automation-id="error-popup-cyberauser-fail"
          error={this.state.submitMessage}
          key="ErrorPopupShow"
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-cyberauser">
        <BreadCrumb data-automation-id="breadcrumb-cyberauser" breadCrumb={breadCrumb} />
        <h2>User</h2>
        <Box>
          <Row>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Button data-automation-id="btn-add-new-cyberauser" onClick={() => this.props.history.push('/CBAdmin/CreateEditUser')}><PlusIcon /> Create new user</Button>
            </Col>
          </Row>
          <Table
            data-automation-id="table-cyberauser"
            dataSource="Users/staff/Cybera"
            header={header}
            body={body}
            downloadBody={downloadbody}
            filter={[]}
            fileName="Cybera User"
          />
        </Box>
        <h2>Pending Invitations</h2>
        <Box>
          <Table
            data-automation-id="table-pending-cyberauser"
            dataSource="Users/PendingInvitation/Websites/0"
            header={pendingInvitationheader}
            body={pendingInvitationbody}
            downloadBody={pendingInvitationDownloadbody}
            filter={[]}
            pageForceReload={this.state.pageForceReloadCount}
            fileName="Cybera User Pending Invitations"
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-cyberauser"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
        { popup }
      </Layout>);
  }
}

CyberaUser.propTypes = {
  history: PropTypes.object.isRequired,
};

export default CyberaUser;
