import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import EditIcon from 'react-icons/lib/md/edit';
import DeleteIcon from 'react-icons/lib/md/delete';
import PlusIcon from 'react-icons/lib/fa/plus';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Table from '../../../../app/components/Table';
import { apiUrl } from '../../../config';
import request from '../../../utils/request';
import styles from './styles.css';
import ErrorPopup from '../../../components/ErrorPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import { formatDate } from '../../../utils';
import Button from '../../../components/Button';

export class CyberaRole extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      sourceName: 'Staff',  // for informing Table components to know the source of data
      filter: [],
      RolePopupShow: false,
      ErrorPopupShow: false,
      submitMessage: '',
      pageForceReloadCount: 0,
    };
  }

  DeleteRole(roleId) {
    request.delete(
      `${apiUrl}/CyberaRole/${roleId}`,
      {},
      (response) => {
        if (!response.error) {
          this.setState({
            submitMessage: 'Role deleted successfully',
            RolePopupShow: true,
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
      <button data-automation-id="btn-cyberauser-link" key="Cybera User" onClick={() => this.props.history.push('/CBAdmin/CyberaUser')}>Cybera User</button>,
      <button data-automation-id="btn-cyberarole-link" key="Users" onClick={() => window.location.reload()}>Role</button>,
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
      (value) => [
      (value.Name !== 'AdministratorCybera' &&
        <button
          key="EditIcon"
          onClick={() => this.props.history.push({
            pathname: '/CBAdmin/CreateEditRole',
            search: `?RoleId=${value.Id}`,
          })}
        ><EditIcon /></button>),
      (value.Name !== 'AdministratorCybera' &&
        <button key="DeleteIcon" style={{ textDecoration: 'none', marginLeft: '10px' }} onClick={() => this.DeleteRole(value.Id)}><DeleteIcon /></button>),
      ],
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
          data-automation-id="popup-cyberarole-success"
          onClose={() => {
            this.setState({ RolePopupShow: false, pageForceReloadCount: this.state.pageForceReloadCount + 1 });
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
          data-automation-id="error-popup-cyberarole-fail"
          error={this.state.submitMessage}
          key="ErrorPopupShow"
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-cyberarole">
        <BreadCrumb data-automation-id="breadcrumb-cyberarole" breadCrumb={breadCrumb} />
        <h2>Role</h2>
        <Box>
          <Row>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Button data-automation-id="btn-add-new-cyberarole" onClick={() => this.props.history.push('/CBAdmin/CreateEditRole')}><PlusIcon /> Create new role</Button>
            </Col>
          </Row>
          <Table
            data-automation-id="table-cyberarole"
            dataSource="CyberaRole"
            header={headerRole}
            body={bodyRole}
            downloadBody={downloadbodyRole}
            filter={this.state.filter}
            pageForceReload={this.state.pageForceReloadCount}
            fileName="Cybera Role"
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-cyberarole"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
        {popup}
      </Layout>);
  }
}

CyberaRole.propTypes = {
  history: PropTypes.object.isRequired,
};

export default CyberaRole;
