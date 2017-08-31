import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Field, reduxForm } from 'redux-form/immutable';
import Searchicon from 'react-icons/lib/md/search';

import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import DatePickerInput from '../../../../components/DatePickerInput';
import { formatDate, AuDatetoNormal, AuDatetoNormalDatePlusOne } from '../../../../utils';
import message from '../../../../Message';

const validate = (values) => {
  const errors = {};
  const requiredFields = {
    StartDate: 'Please select start date.',
    EndDate: 'Please select end date.',
  };
  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
  }

  const date1 = (values.get('StartDate')) ? AuDatetoNormal(values.get('StartDate')) : 0;
  const date2 = (values.get('EndDate')) ? AuDatetoNormal(values.get('EndDate')) : 0;

  if (date1 > date2) {
    errors.StartDate = message.error.STARTDATE_INVALID;
    errors.EndDate = message.error.ENDDATE_INVALID;
  }

  return errors;
};

class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchParams: '',
    };
  }

  search(startDate, endDate) {
    const params = `?$filter=ReceiptDate ge datetimeoffset'${AuDatetoNormal(startDate)}' and ReceiptDate le datetimeoffset'${AuDatetoNormalDatePlusOne(endDate)}'`;
    this.setState({ searchParams: params });
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-merchantsettings-link" key="Settings" onClick={() => this.props.history.push('/MCAdmin/PlanManagement')}>Settings</button>,
      <button data-automation-id="btn-merchant-subscription-link" key="Subscription" onClick={() => this.props.history.push('/MCAdmin/Subscription')}>Subscription</button>,
      <button data-automation-id="btn-merchant-paymenthistory-link" key="Payment History" onClick={() => window.location.reload()}>Payment History</button>,
    ];

    /** setting table payment  */
    const header = [
      { Label: 'Receipt no.', Name: 'ReceiptNumber', align: 'center' },
      { Label: 'ReceiptNumber', Name: 'Hide', align: 'center' },
      { Label: 'Receipt date', Name: 'ReceiptDate', align: 'center' },
      { Label: 'Plan description', Name: 'PlanDescription', align: 'center' },
      { Label: 'Subscription type', Name: 'SubscriptionType', align: 'center' },
      { Label: 'Total Ex GST', Name: 'TotalExGST', align: 'center' },
      { Label: 'GST', Name: 'GST', align: 'center' },
      { Label: 'Total Inc GST', Name: 'TotalIncGST', align: 'center' },
    ];
    const body = [
      (value) => <button
        onClick={() => this.props.history.push({
          pathname: '/MCAdmin/Subscription/PaymentHistory/ReceiptDetail',
          search: `?Id=${value.Id}`,
        })}
      >{value.ReceiptNumber}</button>,
      (value) => value.ReceiptNumber,
      (value) => formatDate(value.ReceiptDate),
      (value) => value.PlanDescription,
      (value) => value.SubscriptionType,
      (value) => `$${value.TotalExGST.toFixed(2)}`,
      (value) => `$${value.GST.toFixed(2)}`,
      (value) => `$${value.TotalIncGST.toFixed(2)}`,
    ];
    const downloadBody = [
      (value) => value.ReceiptNumber,
      (value) => value['Receipt date'],
      (value) => value['Plan description'],
      (value) => value['Subscription type'],
      (value) => value['Total Ex GST'],
      (value) => value.GST,
      (value) => value['Total Inc GST'],
    ];

    return (
      <Layout data-automation-id="page-paymenthistory">
        <BreadCrumb data-automation-id="breadcrumb-paymenthistory" breadCrumb={breadCrumb} />
        <h2>Payment History</h2>
        <Box>
          <form data-automation-id="form-paymenthistory-search" onSubmit={this.props.handleSubmit((value) => this.search(value.get('StartDate'), value.get('EndDate')))}>
            <Row>
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-paymenthistory-startdate" hintText="From" name="StartDate" type="text" component={DatePickerInput} icon={<Searchicon />} />
              </Col>
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-paymenthistory-enddate" hintText="To" name="EndDate" type="text" component={DatePickerInput} icon={<Searchicon />} />
              </Col>
              <Col xs={12} sm={4} lg={2}>
                <Button data-automation-id="btn-paymenthistory-search"><Searchicon /> Search</Button>
              </Col>
            </Row>
          </form>
          <Row>
            <Col xs={12}>
              <Table
                data-automation-id="table-paymenthistory"
                dataSource={`Websites/${localStorage.getItem('websiteID')}/Receipt${this.state.searchParams}`}
                header={header}
                body={body}
                filter={[]}
                downloadBody={downloadBody}
                fileName="Payment History"
                onClearSearch={() => {
                  this.setState({ searchParams: '' }, () => {
                    this.props.reset();
                  });
                }}
              />
            </Col>
          </Row>
        </Box>
      </Layout>
    );
  }
}

PaymentHistory.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'UpdateProfile',
  validate,
})(PaymentHistory);
