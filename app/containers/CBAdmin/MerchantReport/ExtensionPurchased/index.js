import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from 'react-icons/lib/md/search';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';

import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Table from '../../../../../app/components/Table';
import { apiUrl } from '../../../../config';
import { formatDate, saveAs, AuDatetoNormal } from '../../../../utils';
import request from '../../../../utils/request';
import styles from './styles.css';
import ErrorPopup from '../../../../../app/components/ErrorPopup';
import Button from '../../../../components/Button';
import excelIcon from '../excel.svg';
import csvIcon from '../csv.svg';
import DatePickerInput from '../../../../components/DatePickerInput';

class ExtensionPurchased extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      sourceName: 'MerchantReport',
      searchParams: '',
    };
  }

  search(startDate, endDate) {
    const params = `?startDate=${AuDatetoNormal(startDate)}&endDate=${AuDatetoNormal(endDate)}&format=csv`;
    this.setState({ searchParams: params });
  }

  render() {
    const header = [
      { Label: 'Name', Name: 'FirstName', className: styles.name, align: 'center' },
      { Label: 'Total Number of Purchased', Name: 'Total Number of Purchased', align: 'center' },
      { Label: 'Total Purchased Amount', Name: 'Total Purchased Amount', align: 'center' },
    ];

    const body = [
      (value) => value.Name,
      (value) => value.ShopName,
      (value) => value.Email,
      (value) => formatDate(value.DateRegistered),
      (value) => value.Template,
      (value) => value.Plan,
    ];

    return (
      <Layout openedMenu="Reports" activeMenu="Extension Purchased">
        <BreadCrumb
          breadCrumb={[
            <button onClick={() => window.location.reload()}>Reposts</button>,
            <span>/</span>,
            <button onClick={() => window.location.reload()}>Reporting Extension Purchased</button>,
          ]}
        />
        <h2>Reporting Extension Purchased</h2>
        <Box>
          <form onSubmit={this.props.handleSubmit((values) => this.search(values.get('startDate'), values.get('endDate')))}>
            <Row>
              <Col xs={12} sm={6} md={3} lg={3}>
                <Field label="Start Date" name="startDate" type="text" component={DatePickerInput} />
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
                <Field label="End Date" name="endDate" type="text" component={DatePickerInput} />
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div>
                  <Button style={{ marginTop: '13px' }}><SearchIcon /> Search</Button>
                </div>
              </Col>
              <Col xs={12} sm={6} mdOffset={1} md={1} lgOffset={1} lg={1}>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      request.download(`${apiUrl}/Report/MerchantRegisteration${this.state.searchParams}`, (response) => {
                        if (!response.error) {
                          saveAs(response, 'Merchant.csv');
                        } else {
                          this.setState({ error: response.error });
                        }
                      });
                    }}
                    className={styles.download}
                  >
                    <img alt="presentation" width="16" height="16" src={csvIcon} style={{ color: 'red' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      request.download(`${apiUrl}/Report/MerchantRegisteration${this.state.searchParams}`, (response) => {
                        if (!response.error) {
                          saveAs(response, 'Merchant.xlsx');
                        } else {
                          this.setState({ error: response.error });
                        }
                      });
                    }}
                    className={styles.download}
                  >
                    <img alt="presentation" width="16" height="16" src={excelIcon} style={{ color: 'red' }} />
                  </button>
                </div>
              </Col>
            </Row>
          </form>
          <Table
            dataSource={`${apiUrl}/Report/MerchantRegisteration${this.state.searchParams}`}
            header={header}
            body={body}
            sourceName={this.state.sourceName}
            searchParams={this.state.searchParams}
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

ExtensionPurchased.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'ExtensionPurchased',
})(ExtensionPurchased);
