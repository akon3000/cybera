import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from 'react-icons/lib/md/search';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import MenuItem from 'material-ui/MenuItem';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Table from '../../../../app/components/Table';
import { apiUrl } from '../../../config';
import { formatDate } from '../../../utils';
import request from '../../../utils/request';
import ErrorPopup from '../../../../app/components/ErrorPopup';
import Button from '../../../components/Button';
import InputWithIcon from '../../../components/InputWithIcon';
import validate from '../../../utils/validate';
import message from '../../../Message';
import Select from '../../../components/Select';

// import styles from './styles.css';

class WebsiteDashBoard extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      filter: [],
      natureOfBusiness: [],
      sourceName: 'WebsiteDashBoard',
    };
  }

  componentDidMount() {
    const self = this;
    request.get(`${apiUrl}/NatureOfBusiness`, {}, (response) => {
      if (response.data) {
        self.setState({ natureOfBusiness: response.data.Items });
      }
    });
  }

  search(website, merchant, email, businessType) {
    const filter = [
      { Columns: ['Website'], keywords: website },
      { Columns: ['Merchant'], keywords: merchant },
      { Columns: ['Email'], keywords: email },
      { Columns: ['Nature of Business'], keywords: businessType },
    ];
    this.setState({ filter, search: true });
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-merchantdashboard-link" key="administration" onClick={() => this.props.history.push('/CBAdmin/MerchantDashBoard')}>administration</button>,
      <button data-automation-id="btn-websitedashboard-link" key="website" onClick={() => window.location.reload()}>website</button>,
    ];
    const header = [
      { Label: 'Website', Name: 'Website', align: 'center' },
      { Label: 'Merchant', Name: 'Merchant', align: 'center' },
      { Label: 'Email', Name: 'Email', align: 'center' },
      { Label: 'Nature of Business', Name: 'Nature of Business', align: 'center' },
      { Label: 'Plan', Name: 'Plan', align: 'center' },
      { Label: 'Template', Name: 'Template', align: 'center' },
      { Label: 'Subscription Status', Name: 'Subscription Status', align: 'center' },
      { Label: 'Payment Schedule', Name: 'Payment Schedule', align: 'center' },
      { Label: 'Date Created', Name: 'DateCreated', align: 'center' },
      { Label: 'DateCreated', Name: 'Hide', align: 'center' },
    ];

    const body = [
      (value) => value.WebsiteName,
      (value) => value.User && `${value.User.FirstName} ${value.User.LastName}`,
      (value) => value.Email,
      (value) => value.NatureOfBusiness,
      (value) => value.WebsitePlan && value.WebsitePlan.length > 0 && `${value.WebsitePlan[value.WebsitePlan.length - 1].Plan.Name}`,
      (value) => value.Template && `${value.Template.Name}`,
      (value) => (value.SubscriptionStatus ? 'Activate' : 'Deactivate'),
      (value) => value.WebsitePlan && value.WebsitePlan.length > 0 && `${value.WebsitePlan[value.WebsitePlan.length - 1].PaymentScheduleStatus}`,
      (value) => (value.CreatedDate ? formatDate(value.CreatedDate) : ''),
      (value) => value.CreatedDate,
    ];

    const downloadBody = [
      (value) => value.Website,
      (value) => value.Merchant,
      (value) => value.Email,
      (value) => value['Nature of Business'],
      (value) => value.Plan,
      (value) => value.Template,
      (value) => value['Subscription Status'],
      (value) => value['Payment Schedule'],
      (value) => value['Date Created'],
    ];

    const natureOfBusinessMenuItem = [];

    this.state.natureOfBusiness.forEach((n) => {
      natureOfBusinessMenuItem.push(<MenuItem key={`natureOfBusiness_${n.Id}`} value={n.Name} primaryText={n.Name} />);
    });

    return (
      <Layout data-automation-id="page-websitedashboard" openedMenu="Administration" activeMenu="Websites">
        <BreadCrumb data-automation-id="breadcrumb-websitedashboard" breadCrumb={breadCrumb} />
        <h2>Website</h2>
        <Box>
          <form
            data-automation-id="form-websitedashboard-search"
            onSubmit={this.props.handleSubmit((values) => this.search(
            values.get('website'), values.get('merchant'),
            values.get('email'), values.get('businessType')))}
          >
            <Row end="xs">
              <Col xs={12} sm={6} lg={6}>
                <Field data-automation-id="input-websitedashboard-website" hintText="Website name" name="website" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={6} lg={6}>
                <Field data-automation-id="input-websitedashboard-name" hintText="Merchant first name / last name" name="merchant" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={6} lg={6}>
                <Field data-automation-id="input-websitedashboard-email" hintText="Email" name="email" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={6} lg={6}>
                <Field
                  data-automation-id="input-websitedashboard-businesstype"
                  hintText="Business Type"
                  name="businessType"
                  component={Select}
                  icon={<SearchIcon />}
                >
                  {natureOfBusinessMenuItem}
                </Field>
              </Col>
              <Col xs={12} md={3}>
                <Button data-automation-id="btn-websitedashboard-search"><SearchIcon /> Search</Button>
              </Col>
            </Row>
          </form>
          <Table
            data-automation-id="table-websitedashboard"
            dataSource="Websites"
            header={header}
            body={body}
            downloadBody={downloadBody}
            filter={this.state.filter}
            fileName="Websites"
            onClearSearch={() => {
              this.setState({ filter: [] }, () => {
                this.props.reset();
              });
            }}
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-popup-websitedashboard"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

WebsiteDashBoard.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const WebsiteValidate = (values) => {
  const errors = {};

  if (!values.get('website') && !values.get('merchant') && !values.get('email') && !values.get('businessType')) {
    errors.website = 'Please enter website name';
    errors.merchant = 'Please enter first or last name';
    errors.email = 'Please enter email address';
    errors.businessType = 'Please choose nature of business';
  }

  if (values.get('website')) {
    const isValidLength = validate.isValidLength(values.get('website'), 50, 'Website name');
    const isWebsiteName = validate.isWebsiteName(values.get('website'));
    if (isValidLength !== true && isWebsiteName !== true) {
      errors.website = `${isValidLength}.  ${isWebsiteName}.`;
    } else if (isValidLength !== true) {
      errors.website = isValidLength;
    } else if (isWebsiteName !== true) {
      errors.website = isWebsiteName;
    }
  }

  if (values.get('merchant')) {
    const isValidLength = validate.isValidLength(values.get('merchant'), 50, 'Merchant name');
    const isName = validate.isName(values.get('merchant'), "-'.");
    if (isValidLength !== true && isName !== true) {
      errors.merchant = `${isValidLength}.  ${isName}.`;
    } else if (isValidLength !== true) {
      errors.merchant = isValidLength;
    } else if (isName !== true) {
      errors.merchant = isName;
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
  form: 'WebsiteDashBoard',
  validate: WebsiteValidate,
})(WebsiteDashBoard);
