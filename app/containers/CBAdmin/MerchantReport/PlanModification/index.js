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

export const PlanModificationValidate = (values) => {
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


class PlanModification extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      searchParams: '',
    };
  }

  search(startDate, endDate) {
    const params = `?$filter=ModifiedDate ge datetimeoffset'${AuDatetoNormal(startDate)}' and ModifiedDate le datetimeoffset'${AuDatetoNormalDatePlusOne(endDate)}'`;
    this.setState({ searchParams: params });
  }

  render() {
    const header = [
      { Label: 'Name', Name: 'Name', className: styles.name, align: 'center' },
      { Label: 'Website Name', Name: 'Website Name', align: 'center' },
      { Label: 'Email Address', Name: 'Email Address', align: 'center' },
      { Label: 'Current Plan', Name: 'Current Plan', align: 'center' },
      { Label: 'Older Plan', Name: 'Older Plan', align: 'center' },
      { Label: 'Modification Date', Name: 'ModificationDate', align: 'center' },
      { Label: 'ModificationDate', Name: 'Hide', align: 'center' },
    ];

    const body = [
      (value) => value.Name,
      (value) => value.WebsiteName,
      (value) => value.Email,
      (value) => value.CurrentPlan,
      (value) => value.OldPlan,
      (value) => (value.ModifiedDate ? formatDate(value.ModifiedDate) : ''),
      (value) => value.ModifiedDate,
    ];

    const downloadBody = [
      (value) => value.Name,
      (value) => value['Website Name'],
      (value) => value['Email Address'],
      (value) => value['Current Plan'],
      (value) => value['Older Plan'],
      (value) => value['Modification Date'],
    ];

    return (
      <Layout data-automation-id="page-report-planmodification" openedMenu="Reports" activeMenu="Plan Modification">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-report-registration-link" key="Reports" onClick={() => this.props.history.push('/CBAdmin/MerchantReport/Registration')}>Report</button>,
            <button data-automation-id="btn-report-planmodification-link" key="Plan Modification" onClick={() => window.location.reload()}>Plan Modification</button>,
          ]}
        />
        <h2>Plan Modification</h2>
        <Box>
          <form data-automation-id="form-report-planmodification-search" onSubmit={this.props.handleSubmit((values) => this.search(values.get('StartDate'), values.get('EndDate')))}>
            <Row end="xs">
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-report-planmodification-startdate" hintText="From" name="StartDate" type="text" component={DatePickerInput} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-report-planmodification-enddate" hintText="To" name="EndDate" type="text" component={DatePickerInput} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={2}>
                <Button data-automation-id="btn-report-planmodification-search"><SearchIcon /> Search</Button>
              </Col>
            </Row>
          </form>
          <Table
            data-automation-id="table-report-planmodification"
            dataSource={`Report/MerchantPlanModificationReport${this.state.searchParams}`}
            header={header}
            body={body}
            downloadBody={downloadBody}
            filter={[]}
            fileName="Merchant Plan Modification"
            onClearSearch={() => {
              this.setState({ searchParams: '' }, () => {
                this.props.reset();
              });
            }}
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-report-planmodification"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

PlanModification.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'PlanModification',
  validate: PlanModificationValidate,
})(PlanModification);
