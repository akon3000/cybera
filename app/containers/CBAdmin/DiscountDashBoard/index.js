import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from 'react-icons/lib/md/search';
import EditIcon from 'react-icons/lib/md/edit';
import PlusIcon from 'react-icons/lib/fa/plus';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Table from '../../../../app/components/Table';
import { formatDate } from '../../../utils';
import ErrorPopup from '../../../../app/components/ErrorPopup';
import Button from '../../../components/Button';
import InputWithIcon from '../../../components/InputWithIcon';
import validate from '../../../utils/validate';

// import styles from './styles.css';

export class DiscountDashBoard extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      filter: [],
      sourceName: 'Discount',  // for informing Table components to know the source of data
    };
  }

  search(name, code) {
    const filter = [
      { Columns: ['Name'], keywords: name },
      { Columns: ['Code'], keywords: code },
    ];
    this.setState({ filter });
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-discountdashboard-link" key="Marketing" onClick={() => window.location.reload()}>Marketing</button>,
      <button data-automation-id="btn-discountdashboard-link" key="Discounts" onClick={() => window.location.reload()}>Discount</button>,
    ];
    const header = [
      { Label: 'Name', Name: 'Name', align: 'center' },
      { Label: 'Code', Name: 'Code', align: 'center' },
      { Label: 'Usage', Name: 'Usage', align: 'center' },
      { Label: 'Type', Name: 'Type', align: 'center' },
      { Label: 'Minimum Purchase Amount', Name: 'Minimum Purchase Amount', align: 'center' },
      { Label: 'Amount', Name: 'AmountForSort', align: 'center' },
      { Label: 'AmountForSort', Name: 'Hide', align: 'center' },
      { Label: 'Start Date', Name: 'StartDate', align: 'center' },
      { Label: 'StartDate', Name: 'Hide', align: 'center' },
      { Label: 'End Date', Name: 'EndDate', align: 'center' },
      { Label: 'EndDate', Name: 'Hide', align: 'center' },
      { Label: 'Status', Name: 'Status', align: 'center' },
      { Label: 'SortDisable', Name: 'SortDisable', align: 'center' },
    ];

    const body = [
      (value) => value.Name,
      (value) => value.Code,
      (value) => value.Usage,
      (value) => value.Type,
      (value) => `$${value.MinPurchaseAmount.toFixed(2)}`,
      (value) => {
        let amount = '';
        if (value.Type === '% discount') {
          amount = `${value.Amount.toFixed(2)}%`;
        } else if (value.Type === '$ discount') {
          amount = `$${value.Amount.toFixed(2)}`;
        }
        return amount;
      },
      (value) => {
        let amount = 0;
        if (value.Type === '% discount') {
          amount = parseFloat(value.Amount) * 1000000000;
        } else if (value.Type === '$ discount') {
          amount = parseFloat(value.Amount);
        }
        return amount;
      },
      (value) => (value.StartDate ? formatDate(value.StartDate) : ''),
      (value) => value.StartDate,
      (value) => (value.EndDate ? formatDate(value.EndDate) : ''),
      (value) => value.EndDate,
      (value) => (value.IsActive ? 'Activate' : 'Deactivate'), //eslint-disable-line
      (value) => <Link
        to={{
          pathname: '/CBAdmin/CreateEditDiscount',
          search: `?DiscountId=${value.Id}`,
        }}
      ><EditIcon /></Link>,
    ];

    const downloadBody = [
      (value) => value.Name,
      (value) => value.Code,
      (value) => value.Usage,
      (value) => value.Type,
      (value) => value['Minimum Purchase Amount'],
      (value) => value.Amount,
      (value) => value['Start Date'],
      (value) => value['End Date'],
      (value) => value.Status,
    ];

    return (
      <Layout data-automation-id="page-discountdashboard" openedMenu="Marketing" activeMenu="Discounts">
        <BreadCrumb data-automation-id="breadcrumb-discountdashboard" breadCrumb={breadCrumb} />
        <h2>Discount</h2>
        <Box>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <div style={{ paddingBottom: '15px' }}>
                <Button data-automation-id="btn-add-new-discount" type="button" onClick={() => this.props.history.push('/CBAdmin/CreateEditDiscount')}><PlusIcon /> Create New discount</Button>
              </div>
            </Col>
          </Row>
          <form data-automation-id="form-discountdashboard-search" onSubmit={this.props.handleSubmit((values) => this.search(values.get('Name'), values.get('Code')))}>
            <Row end="xs">
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-discountdashboard-name" hintText="Name" name="Name" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-discountdashboard-code" hintText="Code" name="Code" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={2}>
                <Button data-automation-id="btn-discountdashboard-search"><SearchIcon /> Search</Button>
              </Col>
            </Row>
          </form>
          <Table
            data-automation-id="table-discountdashboard"
            dataSource="Discounts?$filter=WebsiteId eq 0"
            header={header}
            body={body}
            downloadBody={downloadBody}
            filter={this.state.filter}
            fileName="Cybera Discounts"
            onClearSearch={() => {
              this.setState({ filter: [] }, () => {
                this.props.reset();
              });
            }}
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-popup-discountdashboard"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

DiscountDashBoard.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const discountValidate = (values) => {
  const errors = {};

  if (!values.get('Name') && !values.get('Code')) {
    errors.Name = 'Please enter discount name';
    errors.Code = 'Please enter discount code';
  }

  if (values.get('Name')) {
    const isValidLength = validate.isValidLength(values.get('Name'), 50, 'Discount name');
    const isNameWithNumbers = validate.isNameWithNumbers(values.get('Name'), '-_');
    if (isValidLength !== true && isNameWithNumbers !== true) {
      errors.Name = `${isValidLength}.  ${isNameWithNumbers}.`;
    } else if (isValidLength !== true) {
      errors.Name = isValidLength;
    } else if (isNameWithNumbers !== true) {
      errors.Name = isNameWithNumbers;
    }
  }

  if (values.get('Code')) {
    const isValidLength = validate.isValidLength(values.get('Code'), 20, 'Discount code');
    if (isValidLength !== true) {
      errors.Code = isValidLength;
    }
  }

  return errors;
};

export default reduxForm({
  form: 'DiscountDashBoard',
  validate: discountValidate,
})(DiscountDashBoard);
