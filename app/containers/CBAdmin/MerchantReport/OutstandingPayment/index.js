import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Table from '../../../../../app/components/Table';
import { formatDate } from '../../../../utils';
import ErrorPopup from '../../../../../app/components/ErrorPopup';

// import styles from './styles.css';

class OutstandingPayment extends Component { // eslint-disable-line

  constructor() {
    super();
    this.state = {
      error: false,
    };
  }

  render() {
    const header = [
      { Label: 'Name', Name: 'Name', align: 'center' },
      { Label: 'Website Name', Name: 'Website Name', align: 'center' },
      { Label: 'Email Address', Name: 'Email Address', align: 'center' },
      { Label: 'Date Registered', Name: 'DateRegistered', align: 'center' },
      { Label: 'DateRegistered', Name: 'Hide', align: 'center' },
      { Label: 'Total Amount Due', Name: 'Total Amount Due', align: 'center' },
      { Label: 'Plan', Name: 'Plan', align: 'center' },
      { Label: 'Template', Name: 'Template', align: 'center' },
    ];

    const body = [
      (value) => value.Name,
      (value) => value.WebsiteName,
      (value) => value.Email,
      (value) => (value.DateRegistered ? formatDate(value.DateRegistered) : ''),
      (value) => value.DateRegistered,
      (value) => `$${value.TotalAmountDue.toFixed(2)}`,
      (value) => value.Plan,
      (value) => value.Template,
    ];

    const downloadBody = [
      (value) => value.Name,
      (value) => value['Website Name'],
      (value) => value['Email Address'],
      (value) => value['Date Registered'],
      (value) => value['Total Amount Due'],
      (value) => value.Plan,
      (value) => value.Template,
    ];

    return (
      <Layout data-automation-id="page-report-outstandingpayment" openedMenu="Reports" activeMenu="Outstanding Payment">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-report-registration-link" key="Reports" onClick={() => this.props.history.push('/CBAdmin/MerchantReport/Registration')}>Report</button>,
            <button data-automation-id="btn-report-outstandingpayment-link" key="Outstanding Payment" onClick={() => window.location.reload()}>Outstanding Payments</button>,
          ]}
        />
        <h2>Outstanding Payments</h2>
        <Box>
          <Table
            data-automation-id="table-report-outstandingpayment"
            dataSource="Report/MerchantOutstandingPayment"
            header={header}
            body={body}
            downloadBody={downloadBody}
            filter={[]}
            fileName="Merchant Outstanding Payments"
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-report-outstandingpayment"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

OutstandingPayment.propTypes = {
  history: PropTypes.object.isRequired,
};

export default OutstandingPayment;
