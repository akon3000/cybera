import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import styles from './styles.css';
import Input from '../../../components/Input';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';
import Loading from '../../../components/Loading';
import { formatDate } from '../../../utils';
import message from '../../../Message';
import validate from '../../../utils/validate';
import RadioGroup from '../../../components/RadioGroup';
import ResetPasswordPopup from './ResetPassword';
import Button from '../../../components/Button';
import SuccessPopup from '../../../components/SuccessPopup';
import ErrorPopup from '../../../components/ErrorPopup';

export const formvalidate = (values) => {
  const errors = {};

  const requiredFields = {
    title: 'Please select title',
    firstName: 'Please enter first name',
    lastName: 'Please enter last name',
    phoneNumber: 'Please enter phone number',
  };

  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
  }

  if (!values.get('email')) {
    errors.email = 'Please enter email address';
  } else {
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

  if (values.get('firstName')) {
    const isValidLength = validate.isValidLength(values.get('firstName'), 50, 'First name');
    const isName = validate.isName(values.get('firstName'), "-'.");
    if (isValidLength !== true && isName !== true) {
      errors.firstName = `${isValidLength}.  ${isName}.`;
    } else if (isValidLength !== true) {
      errors.firstName = isValidLength;
    } else if (isName !== true) {
      errors.firstName = isName;
    }
  }

  if (values.get('lastName')) {
    const isValidLength = validate.isValidLength(values.get('lastName'), 50, 'Last name');
    const isName = validate.isName(values.get('lastName'), "-'.");
    if (isValidLength !== true && isName !== true) {
      errors.lastName = `${isValidLength}.  ${isName}.`;
    } else if (isValidLength !== true) {
      errors.lastName = isValidLength;
    } else if (isName !== true) {
      errors.lastName = isName;
    }
  }

  if (values.get('phoneNumber')) {
    const isValidLength = validate.isValidLength(values.get('phoneNumber'), 14, 'Phone number');
    const matchContactNumber = validate.matchContactNumber(values.get('phoneNumber'));
    if (isValidLength !== true && matchContactNumber !== true) {
      errors.phoneNumber = `${isValidLength}.  ${matchContactNumber}.`;
    } else if (isValidLength !== true) {
      errors.phoneNumber = isValidLength;
    } else if (matchContactNumber !== true) {
      errors.phoneNumber = matchContactNumber;
    }
  }

  return errors;
};

export class MerchantDetails extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      merchant_data: [],
      extensionsPurchased: [],
      purchasedDomains: [],
      purchasedEmails: [],
      websites: [],
      loading: true,
      merchant_id: '',
      submitMessage: '',
      MerchantPopupShow: false,
      ErrorPopupShow: false,
      showResetPassword: false,
    };
  }

  componentDidMount() {
    const self = this;
    request.get(`${apiUrl}/User/Merchant/${this.props.location.query.MerchantId}`, {}, (response) => {
      if (response.data) {
        self.handleInitialize(response.data);
        self.setState({ loading: false,
          merchant_data: response.data,
          extensionsPurchased: response.data.WebsiteExtension,
          purchasedDomains: response.data.Domains,
          purchasedEmails: response.data.PurchasedEmails,
          websites: response.data.Website,
          merchant_id: this.props.location.query.MerchantId,
        });
      }
    });
  }

  handleInitialize(data) {
    const initData = {
      firstName: (data.FirstName) ? data.FirstName : '',
      lastName: (data.LastName) ? data.LastName : '',
      title: (data.Title) ? data.Title.Name : '',
      phoneNumber: (data.PhoneNumber) ? data.PhoneNumber : '',
      email: (data.Email) ? data.Email : '',
      dateOfBirth: (data.BirthDate) ? formatDate(data.BirthDate) : '',
      newsletterSubscriptionStatus: (data.IsReceiveCyberaNewsLetter) ? 'Activate' : 'Deactivate',
    };
    this.props.initialize(initData);
  }

  submit(values) {
    this.setState({ loading: true });
    let titleId;
    if (values.get('title') === 'Mr.') {
      titleId = 1;
    } else if (values.get('title') === 'Mrs.') {
      titleId = 2;
    } else if (values.get('title') === 'Ms.') {
      titleId = 3;
    } else if (values.get('title') === 'Miss.') {
      titleId = 4;
    }
    request.put(
      `${apiUrl}/User/Merchant/${this.props.location.query.MerchantId}`,
      {
        Id: this.state.merchant_id,
        FirstName: values.get('firstName'),
        LastName: values.get('lastName'),
        PhoneNumber: values.get('phoneNumber'),
      //  BirthDate: AuDatetoNormal(values.get('dateOfBirth')),
        BirthDate: this.state.merchant_data.BirthDate,
        TitleId: titleId,
        Email: values.get('email'),
      },
      (response) => {
        if (!response.error) {
          this.setState({
            submitMessage: 'Merchant details saved',
            MerchantPopupShow: true,
            loading: false,
          });
        } else {
          this.setState({
            ErrorPopupShow: true,
            loading: false,
            submitMessage: response.error });
        }
      }
    );
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-merchantdashboard-link" key="Administration" onClick={() => this.props.history.push('/CBAdmin/MerchantDashBoard')}>Administration</button>,
      <button data-automation-id="btn-merchantdashboard-link" key="Merchants" onClick={() => this.props.history.push('/CBAdmin/MerchantDashBoard')}>Merchant</button>,
      <button data-automation-id="btn-merchantdetail-link" key="Merchant Information" onClick={() => window.location.reload()}>Merchant Information</button>,
    ];
    const { handleSubmit } = this.props;
    const disable = true;
    const popup = [];

    if (this.state.MerchantPopupShow) {
      popup.push(
        <SuccessPopup
          key="MerchantPopupWindow"
          data-automation-id="popup-merchant-detail-edit-success"
          onClose={() => {
            this.setState({ MerchantPopupShow: false });
            this.props.history.push('/CBAdmin/MerchantDashBoard');
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
          data-automation-id="error-popup-merchant-detail-edit-fail"
          key="MerchantPopupWindowS"
          error={this.state.submitMessage}
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    const titleGroup = [];
    titleGroup[0] = <radio key="mr" value="Mr." label="Mr." />;
    titleGroup[1] = <radio key="mrs" value="Mrs." label="Mrs." />;
    titleGroup[2] = <radio key="ms" value="Ms." label="Ms." />;
    titleGroup[3] = <radio key="miss" value="Miss." label="Miss." />;

    const WebsiteExtension = [];
    let extensionCount = 0;
    if (this.state.extensionsPurchased.length > 0) {
      this.state.extensionsPurchased.forEach((value) => {
        WebsiteExtension.push(<li data-automation-id="list-merchant-detail-extension" key={`Extension${extensionCount}`}>{value.Extension.Name}</li>);
        extensionCount += 1;
      });
    } else {
      WebsiteExtension.push(<li data-automation-id="list-merchant-detail-extension" key="emptyExtension" style={{ border: 'none' }}></li>);
    }

    const purchasedDomains = [];
    let DomainCount = 0;
    if (this.state.purchasedDomains.length > 0) {
      this.state.purchasedDomains.forEach((value) => {
        purchasedDomains.push(<li data-automation-id="list-merchant-detail-domain" key={`Domain${DomainCount}`}>{value.Name}</li>);
        DomainCount += 1;
      });
    } else {
      purchasedDomains.push(<li data-automation-id="list-merchant-detail-domain" key="emptyDomain"></li>);
    }

    const purchasedEmails = [];
    let EmailCount = 0;
    if (this.state.purchasedEmails.length > 0) {
      this.state.purchasedEmails.forEach((value) => {
        purchasedEmails.push(<li data-automation-id="list-merchant-detail-purchasedemails" key={`Email${EmailCount}`}>{value.Name}</li>);
        EmailCount += 1;
      });
    } else {
      purchasedEmails.push(<li data-automation-id="list-merchant-detail-purchasedemails" key="emptyEmail"></li>);
    }

    const websitesInfo = [];
    let websiteCount = 0;
    if (this.state.websites.length > 0) {
      this.state.websites.forEach((value) => {
        const initCreateDate = {
          input: {
            name: 'websiteCreatedDate',
            value: (value.CreatedDate) ? formatDate(value.CreatedDate) : '' },
        };
        const initPlan = {
          input: {
            name: 'websitePlan',
            value: (value.WebsitePlan[0] && value.WebsitePlan[0].Plan) ? value.WebsitePlan[0].Plan.Name : '' },
        };
        const initNatureofBusiness = {
          input: {
            name: 'websiteNatureofBusiness',
            value: (value.NatureOfBusiness) ? value.NatureOfBusiness : '' },
        };
        const initStatus = {
          input: {
            name: 'websiteStatus',
            value: (value.Status === 'Active') ? 'Activate' : 'Deactivate' },
        };
        const initTemplate = {
          input: {
            name: 'websiteTemplate',
            value: (value.Template) ? value.Template.Name : '' },
        };
        const initPaymentSchedule = {
          input: {
            name: 'websitePaymentSchedule',
            value: (value.PaymentSchedule) ? value.PaymentSchedule : '' },
        };
        websitesInfo.push(
          <div key={`Website${websiteCount}`}>
            <Row>
              <Col xs={12} md={6}>
                <div className={styles.websiteName}>
                  <label htmlFor="websiteName">Name</label>
                  <div data-automation-id="list-merchant-detail-websitename">{value.WebsiteName}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="list-merchant-detail-website-createdate" label="Created Date" name="websiteCreatedDate" type="text" disabled={disable} component={Input} {...initCreateDate} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="list-merchant-detail-website-plan" label="Plan" name="websitePlan" type="text" disabled={disable} component={Input} {...initPlan} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="list-merchant-detail-website-natureofbusiness" label="Nature of Business" name="websiteNatureofBusiness" type="text" disabled={disable} component={Input} {...initNatureofBusiness} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="list-merchant-detail-website-status" label="Website Status" name="websiteStatus" type="text" disabled={disable} component={Input} {...initStatus} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="list-merchant-detail-website-template" label="Template" name="websiteTemplate" type="text" disabled={disable} component={Input} {...initTemplate} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="list-merchant-detail-website-paymentschedule" label="Payment Schedule" name="websitePaymentSchedule" type="text" disabled={disable} component={Input} {...initPaymentSchedule} />
              </Col>
            </Row>
            <br />
          </div>
        );
        websiteCount += 1;
      });
    }

    // if (this.state.loading === true) {
    //   return (
    //     <Layout data-automation-id="page-merchantdetail" openedMenu="Merchants" activeMenu="Administration">
    //       <BreadCrumb data-automation-id="breadcrumb-merchantdetail" title="Merchant Information" breadCrumb={breadCrumb} />
    //       <Box>
    //         <h1>Merchant Information</h1>
    //         <Loading />
    //       </Box>
    //     </Layout>);
    // }
    return (
      <Layout data-automation-id="page-merchantdetail" openedMenu="Merchants" activeMenu="Administration">
        <BreadCrumb data-automation-id="breadcrumb-merchantdetail" breadCrumb={breadCrumb} />
        <h2>Merchant Information</h2>
        <Box>
          <Row>
            <Col xs={12} md={6} mdOffset={6}>
              <div className={styles.buttonFooter}>
                <Button data-automation-id="btn-merchantdetail-updatepassword" onClick={() => { this.setState({ showResetPassword: true }); }}>Update Password</Button>
              </div>
            </Col>
          </Row>
          <form data-automation-id="form-merchantdetail" onSubmit={handleSubmit((values) => this.submit(values))}>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-merchantdetail-title" name="title" component={RadioGroup} label="title">
                  {titleGroup}
                </Field>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-merchantdetail-firstname" label="First name" name="firstName" type="text" component={Input} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-merchantdetail-lastname" label="Last Name" name="lastName" type="text" component={Input} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-merchantdetail-phone" label="Phone Number" name="phoneNumber" type="text" component={Input} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-merchantdetail-email" label="Email Address" name="email" type="text" component={Input} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-merchantdetail-dob" label="Date of Birth" name="dateOfBirth" type="text" disabled={disable} component={Input} />
              </Col>
              <Col xs={12} md={6}>
                <div className={styles.extensionContainer}>
                  <label htmlFor="Purchased Extension">Purchased Extension</label>
                  <ul data-automation-id="ul-merchantdetail-extension" name="ExtensionsPurchased">
                    {WebsiteExtension}
                  </ul>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field label="Newsletter Subscription Status" name="newsletterSubscriptionStatus" type="text" disabled={disable} component={Input} />
              </Col>
              <Col xs={12} md={6}>
                <div className={styles.container}>
                  <label htmlFor="Purchased Domains">Purchased Domains</label>
                  <ul data-automation-id="ul-merchantdetail-purchaseddomain" name="PurchasedDomains">
                    {purchasedDomains}
                  </ul>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <div className={styles.container}>
                  <label htmlFor="Purchased Email Address">Purchased Email Address</label>
                  <ul data-automation-id="ul-merchantdetail-purchasedemail" name="Purchased Email Address">
                    {purchasedEmails}
                  </ul>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className={styles.buttonFooter}>
                  <Button data-automation-id="btn-merchantdetail-save" type="submit">Save</Button>
                  <Button data-automation-id="btn-merchantdetail-cancel" type="button" btnStyle="negative" onClick={() => this.props.history.push('/CBAdmin/MerchantDashBoard')}>Cancel</Button>
                </div>
              </Col>
            </Row>
          </form>
          <br />
        </Box>
        <h2>Website Information</h2>
        <Box>{websitesInfo}</Box>
        { popup }
        { this.state.showResetPassword &&
          <ResetPasswordPopup
            data-automation-id="popup-merchantdetail-resetpassword"
            onClose={() => { this.setState({ showResetPassword: false }); }}
            UserId={this.props.location.query.MerchantId}
          />
        }
        { this.state.loading && <Loading /> }
      </Layout>);
  }
}

MerchantDetails.propTypes = {
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'MerchantDetails',
  validate: formvalidate,
})(MerchantDetails);
