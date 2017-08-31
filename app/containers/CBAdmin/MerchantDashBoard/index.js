import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import SearchIcon from 'react-icons/lib/md/search';
import { Field, reduxForm } from 'redux-form/immutable';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Table from '../../../../app/components/Table';
import { formatDate } from '../../../utils';
// import styles from './styles.css';
import ErrorPopup from '../../../../app/components/ErrorPopup';
import Button from '../../../components/Button';
import InputWithIcon from '../../../components/InputWithIcon';
import validate from '../../../utils/validate';
import message from '../../../Message';

class MerchantDashBoard extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      filter: [],
      sourceName: 'MerchantDashBoard',
    };
  }

  search(fullName, email) {
    const filter = [
      { Columns: ['FullName'], keywords: fullName },
      { Columns: ['Email'], keywords: email },
    ];
    this.setState({ isSearch: true, filter });
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-merchantdashboard-link" key="Administration" onClick={() => window.location.reload()}>Administration</button>,
      <button data-automation-id="btn-merchantdashboard-link1" key="Merchants" onClick={() => window.location.reload()}>Merchant</button>,
    ];
    const header = [
      { Label: 'Name', Name: 'FullName', align: 'center' },
      { Label: 'FullName', Name: 'Hide', align: 'center' },
      { Label: 'Title', Name: 'Title', align: 'center' },
      { Label: 'Phone Number', Name: 'Phone Number', align: 'center' },
      { Label: 'Email', Name: 'Email', align: 'center' },
      { Label: 'Date of Birth', Name: 'DateofBirth', align: 'center' },
      { Label: 'DateofBirth', Name: 'Hide', align: 'center' },
    ];

    const body = [
      (value) => (<button
        data-automation-id="btn-merchantdetail-link"
        style={{ wordWrap: 'break-word', width: '100%' }}
        onClick={() => this.props.history.push({
          pathname: '/CBAdmin/MerchantDetails',
          search: `?MerchantId=${value.Id}`,
        })}
      >{value.FirstName} {value.LastName}</button>),
      (value) => `${value.FirstName[0].toUpperCase() + value.FirstName.slice(1)} ${value.LastName[0].toUpperCase() + value.LastName.slice(1)}`,
      (value) => (value.Title && value.Title.Name),
      (value) => value.PhoneNumber,
      (value) => value.Email,
      (value) => (value.BirthDate ? formatDate(value.BirthDate) : ''),
      (value) => value.BirthDate,
    ];

    const downloadBody = [
      (value) => value.FullName,
      (value) => value.Title,
      (value) => value['Phone Number'],
      (value) => value.Email,
      (value) => value['Date of Birth'],
    ];

    return (
      <Layout data-automation-id="page-merchantdashboard" openedMenu="Administration" activeMenu="Merchants">
        <BreadCrumb data-automation-id="breadcrumb-merchantdashboard" breadCrumb={breadCrumb} />
        <h2>Merchant</h2>
        <Box>
          <form data-automation-id="form-merchantdashboard-search" onSubmit={this.props.handleSubmit((values) => this.search(values.get('fullName'), values.get('email')))}>
            <Row end="xs">
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-merchantdashboard-name" hintText="First name / Last name" name="fullName" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-merchantdashboard-email" hintText="Email" name="email" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={2}>
                <Button data-automation-id="btn-merchantdashboard-search"><SearchIcon /> Search</Button>
              </Col>
            </Row>
          </form>
          <Table
            data-automation-id="table-merchantdashboard"
            dataSource="User/Websites/0/Merchant"
            header={header}
            body={body}
            downloadBody={downloadBody}
            filter={this.state.filter}
            fileName="Merchants"
            onClearSearch={() => {
              this.setState({ filter: [] }, () => {
                this.props.reset();
              });
            }}
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-popup-merchantdashboard"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

MerchantDashBoard.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const merchantValidate = (values) => {
  const errors = {};

  if (!values.get('fullName') && !values.get('email')) {
    errors.fullName = 'Please enter first or last name';
    errors.email = 'Please enter email address';
  }

  if (values.get('fullName')) {
    const isValidLength = validate.isValidLength(values.get('fullName'), 50, 'Name');
    const isName = validate.isName(values.get('fullName'), "-'.");
    if (isValidLength !== true && isName !== true) {
      errors.fullName = `${isValidLength}.  ${isName}.`;
    } else if (isValidLength !== true) {
      errors.fullName = isValidLength;
    } else if (isName !== true) {
      errors.fullName = isName;
    }
  }

  if (values.get('email')) {
    const isValidLength = validate.isValidLength(values.get('email'), 100, 'Email address');
    const isEmail = validate.isEmail(values.get('email'));
    if (isValidLength !== true && !isEmail) {
      errors.email = `${isValidLength}.  ${message.error.NOT_VALID_EMAIL}.`;
    } else if (isValidLength !== true) {
      errors.email = isValidLength;
    } else if (!isEmail) {
      errors.email = message.error.NOT_VALID_EMAIL;
    }
  }

  return errors;
};

export default reduxForm({
  form: 'MerchantDashBoard',
  validate: merchantValidate,
})(MerchantDashBoard);
