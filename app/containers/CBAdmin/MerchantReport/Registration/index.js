import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from 'react-icons/lib/md/search';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Table from '../../../../../app/components/Table';
import { formatDate, AuDatetoNormal, AuDatetoNormalDatePlusOne } from '../../../../utils';
import styles from './styles.css';
import ErrorPopup from '../../../../../app/components/ErrorPopup';
import Button from '../../../../components/Button';
import DatePickerInput from '../../../../components/DatePickerInput';
import message from '../../../../Message';

export const RegistrationValidate = (values) => {
  const errors = {};

  const requiredFields = {
    StartDate: 'Please select start date',
    EndDate: 'Please select end date',
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


class Registration extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      searchParams: '',
    };
  }

  search(startDate, endDate) {
    const params = `?$filter=DateRegistered ge datetimeoffset'${AuDatetoNormal(startDate)}' and DateRegistered le datetimeoffset'${AuDatetoNormalDatePlusOne(endDate)}'`;
    this.setState({ searchParams: params });
  }

  render() {
    const header = [
      { Label: 'Name', Name: 'Name', className: styles.name, align: 'center' },
      { Label: 'Website Name', Name: 'Website Name', align: 'center' },
      { Label: 'Email Address', Name: 'Email Address', align: 'center' },
      { Label: 'Date Registered', Name: 'DateRegistered', align: 'center' },
      { Label: 'DateRegistered', Name: 'Hide', align: 'center' },
      { Label: 'Plan', Name: 'Plan', align: 'center' },
      { Label: 'Template', Name: 'Template', align: 'center' },
    ];

    const body = [
      (value) => value.Name,
      (value) => value.WebsiteName,
      (value) => value.Email,
      (value) => (value.DateRegistered ? formatDate(value.DateRegistered) : ''),
      (value) => value.DateRegistered,
      (value) => value.Plan,
      (value) => value.Template,
    ];

    const downloadBody = [
      (value) => value.Name,
      (value) => value['Website Name'],
      (value) => value['Email Address'],
      (value) => value['Date Registered'],
      (value) => value.Plan,
      (value) => value.Template,
    ];

    return (
      <Layout data-automation-id="page-report-registration" openedMenu="Reports" activeMenu="New Registration">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-report-registration-link" key="Reports" onClick={() => window.location.reload()}>Report</button>,
            <button data-automation-id="btn-report-registration-link" key="New Registration" onClick={() => window.location.reload()}>New Registration</button>,
          ]}
        />
        <h2>New Registration</h2>
        <Box>
          <form data-automation-id="form-report-registration-search" onSubmit={this.props.handleSubmit((values) => this.search(values.get('StartDate'), values.get('EndDate')))}>
            <Row end="xs">
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-report-registration-startdate" hintText="From" name="StartDate" type="text" component={DatePickerInput} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-report-registration-enddate" hintText="To" name="EndDate" type="text" component={DatePickerInput} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={2}>
                <Button data-automation-id="btn-report-registration-search"><SearchIcon /> Search</Button>
              </Col>
            </Row>
          </form>
          <Table
            data-automation-id="table-report-registration"
            dataSource={`Report/MerchantRegisterationReport${this.state.searchParams}`}
            header={header}
            body={body}
            downloadBody={downloadBody}
            filter={[]}
            fileName="Merchant Plan Registration"
            onClearSearch={() => {
              this.setState({ searchParams: '' }, () => {
                this.props.reset();
              });
            }}
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-report-registration"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

Registration.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default reduxForm({ // eslint-disable-line
  form: 'Registration',
  validate: RegistrationValidate,
})(Registration);
