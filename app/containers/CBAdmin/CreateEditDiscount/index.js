import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, reset } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import IconLoading from 'react-icons/lib/fa/spinner';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import DatePickerInput from '../../../components/DatePickerInput';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';
import Loading from '../../../components/Loading';
import { AuDatetoNormal } from '../../../utils';
import styles from './styles.css';
import message from '../../../Message';
import validate from '../../../utils/validate';
import Button from '../../../components/Button';
import SuccessPopup from '../../../components/SuccessPopup';
import ErrorPopup from '../../../components/ErrorPopup';

export const discountFormValidate = (values) => {
  const errors = {};

  const requiredFields = {
    Name: 'Please enter name',
    Usage: 'Please choose usage',
    Type: 'Please choose type',
    StartDate: 'Please select start date',
    EndDate: 'Please select end date',
  };

  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
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

  const date1 = (values.get('StartDate')) ? AuDatetoNormal(values.get('StartDate')) : 0;
  const date2 = (values.get('EndDate')) ? AuDatetoNormal(values.get('EndDate')) : 0;

  if (date1 > date2) {
    errors.StartDate = message.error.STARTDATE_INVALID;
    errors.EndDate = message.error.ENDDATE_INVALID;
  }

  if (!values.get('Amount')) {
    errors.Amount = 'Please enter amount';
  } else if (values.get('Type') === '% discount') {
    if (!(/^\d{0,2}(\.\d{1,2})?$/i.test(values.get('Amount')))) {
      errors.Amount = 'Please enter valid amount. Note: maximum 2 numbers allowed with 2 decimal places';
    }
  } else if (values.get('Type') === '$ discount') {
    if (!validate.isDollarAmount(values.get('Amount'))) {
      errors.Amount = message.error.DOLLAR_AMOUNT_INCORRECT;
    }
  }

  return errors;
};

export class CreateEditDiscount extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
      submitMessage: '',
      pageFunction: '',
      IsActive: false,
      DiscountId: '',
      Code: '',
      codeInput: '',
      errorCodeInput: '',
      codeLoading: false,
      codeExisting: false,
      minimumPurchaseAmount: '0.00',
      errorMinimumAmount: '',
      DiscountPopupShow: false,
      ErrorPopupShow: false,
    };
  }

  componentDidMount() {
    const self = this;
    const query = this.props.location.query.DiscountId;
    if (query !== undefined) {
      request.get(`${apiUrl}/Discounts/${query}`, {}, (response) => {
        if (response.data) {
          self.handleInitialize(response.data);
          self.setState({ loading: false,
            pageFunction: 'Edit',
            IsActive: response.data.IsActive,
            DiscountId: query,
            Code: response.data.Code,
            codeInput: response.data.Code,
            minimumPurchaseAmount: (response.data.MinPurchaseAmount !== 0) ? response.data.MinPurchaseAmount : '0.00',
          });
        }
      });
    } else {
      self.setState({
        loading: false,
        pageFunction: 'Create',
      });
    }
  }

  handleInitialize(data) {
    const initData = {
      Name: (data.Name) ? data.Name : '',
      Usage: (data.Usage) ? data.Usage : '',
      Type: (data.Type) ? data.Type : '',
      Amount: (data.Amount) ? data.Amount : '',
      StartDate: (data.StartDate) ? AuDatetoNormal(data.StartDate) : '',
      EndDate: (data.EndDate) ? AuDatetoNormal(data.EndDate) : '',
    };
    this.props.initialize(initData);
  }

  minimumInputValidation() {
    if (!validate.isDollarAmount(this.state.minimumPurchaseAmount)) {
      this.setState({ errorMinimumAmount: 'Please enter valid minimum purchase amount. Note: maximum 7 numbers allowed with 2 decimal places' });
    } else {
      this.setState({ errorMinimumAmount: '' });
    }
  }

  codeInputValidation() {
    if (!this.state.codeInput) {
      this.setState({ errorCodeInput: 'Please enter code' });
    } else if (validate.isValidLength(this.state.codeInput, 20, 'Discount code') !== true) {
      this.setState({ errorCodeInput: validate.isValidLength(this.state.codeInput, 20, 'Discount code') });
    } else {
      this.setState({ errorCodeInput: '' }, () => this.checkCodeValidation());
    }
  }

  checkCodeValidation() {
    this.setState({ codeLoading: true });
    if (this.state.pageFunction === 'Edit' && this.state.Code === this.state.codeInput) {
      this.setState({ codeLoading: false });
    } else {
      request.get(`${apiUrl}/Discounts/CodeValidation/${this.state.codeInput}`, {},
        (response) => {
          if (!response.error) {
            this.setState({ codeLoading: false });
          } else {
            this.setState({ codeLoading: false, errorCodeInput: 'Code already exists. Please enter a new code.' });
          }
        }
      );
    }
  }

  submit(values) {
    const dateData = {
      StartDate: '',
      EndDate: '',
    };
    let minimumAmount = 0.00;
    if (this.state.minimumPurchaseAmount) {
      if (typeof (this.state.minimumPurchaseAmount) === 'string') {
        minimumAmount = parseFloat((this.state.minimumPurchaseAmount).replace(',', ''));
      } else {
        minimumAmount = this.state.minimumPurchaseAmount;
      }
    }

    if (this.state.codeInput === '') {
      this.setState({ errorCodeInput: 'Please enter code' });
    } else if (this.state.errorMinimumAmount === '' && this.state.errorCodeInput === '' && this.state.codeInput !== '') {
      if (this.state.pageFunction === 'Create') {
        const createBodyParams = {
          Name: values.get('Name'),
          Code: this.state.codeInput,
          Amount: (typeof (values.get('Amount')) === 'string') ? parseFloat((values.get('Amount')).replace(',', '')) :
          values.get('Amount'),
          Usage: values.get('Usage'),
          Type: values.get('Type'),
          MinPurchaseAmount: minimumAmount,
          StartDate: AuDatetoNormal(values.get('StartDate')),
          EndDate: AuDatetoNormal(values.get('EndDate')),
        };
        request.post(
          `${apiUrl}/Discounts`,
          createBodyParams,
          (response) => {
            if (!response.error) {
              this.setState({
                submitMessage: 'New discount created',
                DiscountPopupShow: true,
                loading: false,
              });
              this.props.dispatch(reset('CreateEditDiscount'));
              this.props.initialize(dateData);
            } else {
              this.setState({
                ErrorPopupShow: true,
                loading: false,
                submitMessage: response.error,
              });
            }
          }
        );
      } else if (this.state.pageFunction === 'Edit') {
        const editBodyParams = {
          Id: this.state.DiscountId,
          Name: values.get('Name'),
          Code: this.state.codeInput,
          Amount: (typeof (values.get('Amount')) === 'string') ? parseFloat((values.get('Amount')).replace(',', '')) :
          values.get('Amount'),
          Usage: values.get('Usage'),
          Type: values.get('Type'),
          MinPurchaseAmount: minimumAmount,
          StartDate: AuDatetoNormal(values.get('StartDate')),
          EndDate: AuDatetoNormal(values.get('EndDate')),
          IsActive: this.state.IsActive,
        };
        request.put(
          `${apiUrl}/Discounts/${this.state.DiscountId}`,
          editBodyParams,
          (response) => {
            if (!response.error) {
              this.setState({
                submitMessage: 'Discount details updated',
                DiscountPopupShow: true,
                loading: false,
              });
            } else {
              this.setState({
                submitMessage: response.error,
                ErrorPopupShow: true,
                loading: false,
              });
            }
          }
        );
      }
    }
  }

  ToggleStatus() {
    if (this.state.IsActive) {
      this.setState({ IsActive: false });
    } else {
      this.setState({ IsActive: true });
    }
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-discountdashboard-link" key="Marketing" onClick={() => this.props.history.push('/CBAdmin/DiscountDashBoard')}>Marketing</button>,
      <button data-automation-id="btn-discountdashboard-link" key="Discounts" onClick={() => this.props.history.push('/CBAdmin/DiscountDashBoard')}>Discount</button>,
      <button data-automation-id="btn-create-add-discount-link" key="Add_Edit_Discounts" onClick={() => window.location.reload()}>{(this.state.pageFunction === 'Create') ? 'Create New Discount' : 'Edit Discount'}</button>,
    ];
    const { handleSubmit } = this.props;
    const popup = [];

    if (this.state.DiscountPopupShow) {
      popup.push(
        <SuccessPopup
          key="DiscountPopupWindow"
          data-automation-id="popup-discount-create-edit-success"
          onClose={() => {
            this.setState({ DiscountPopupShow: false });
            this.props.history.push('/CBAdmin/DiscountDashBoard');
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
          data-automation-id="error-popup-discount-create-edit-fail"
          error={this.state.submitMessage}
          key="DiscountPopupError"
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-create-add-discount" openedMenu="Campaigns" activeMenu="Discounts">
        <BreadCrumb data-automation-id="breadcrumb-create-add-discount" breadCrumb={breadCrumb} />
        <h2>{(this.state.pageFunction === 'Create') ? 'Create New Discount' : 'Edit Discount'}</h2>
        <Box>
          <form data-automation-id="form-create-add-discount" onSubmit={handleSubmit((values) => this.submit(values))}>
            <Row style={{ marginBottom: '20px' }}>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-create-add-discount-name" label="Name" name="Name" type="text" component={Input} />
              </Col>
              <Col xs={12} md={6}>
                <div className={styles.textFieldContainer}>
                  <label htmlFor="Code">Code</label>
                  <TextField
                    data-automation-id="input-create-add-discount-code"
                    className={styles.textField}
                    name="Code"
                    value={this.state.codeInput}
                    errorText={this.state.errorCodeInput}
                    onChange={(event) => this.setState({ codeInput: event.target.value },
                    () => this.codeInputValidation())}
                    underlineStyle={{ borderColor: '#D7D7D7' }}
                    errorStyle={{ color: '#F44336' }}
                  />
                  {this.state.codeLoading &&
                    <div className={styles.codeLoadingContainer}>
                      <IconLoading className={styles.loading} style={{ float: 'right' }} />
                    </div>
                  }
                </div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Col xs={12} md={6}>
                <Field data-automation-id="select-create-add-discount-usage" label="Usage" name="Usage" component={Select}>
                  <MenuItem key="Multiple use" value="Multiple use" primaryText="Multiple use" />
                  <MenuItem key="Single use" value="Single use" primaryText="Single use" />
                </Field>
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="select-create-add-discount-type" label="Type" name="Type" component={Select}>
                  <MenuItem key="% discount" value="% discount" primaryText="% discount" />
                  <MenuItem key="$ discount" value="$ discount" primaryText="$ discount" />
                </Field>
              </Col>
            </Row>
            <Row style={{ marginBottom: '25px' }}>
              <Col xs={12} md={6}>
                <div className={styles.textFieldCodeContainer}>
                  <label htmlFor="Minimum purchase amount">Minimum purchase amount</label>
                  <TextField
                    data-automation-id="input-create-add-discount-minimum-amount"
                    className={styles.textFieldCode}
                    name="minimumpurchaseamount"
                    value={this.state.minimumPurchaseAmount}
                    errorText={this.state.errorMinimumAmount}
                    onChange={(event) => this.setState({ minimumPurchaseAmount: event.target.value },
                    () => this.minimumInputValidation())}
                    underlineStyle={{ borderColor: '#D7D7D7' }}
                    errorStyle={{ color: '#F44336' }}
                  />
                  <div style={{ fontSize: '10px' }}>Optional: If set, user must meet this total before the discount can be used.</div>
                </div>
              </Col>
              <Col xs={12} md={6} className={styles.AmountContainer}>
                <Field data-automation-id="input-create-add-discount-amount" label="Amount" name="Amount" type="text" component={Input} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-create-add-discount-startdate" label="from" name="StartDate" component={DatePickerInput} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-create-add-discount-enddate" label="to" name="EndDate" component={DatePickerInput} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                {(this.state.pageFunction === 'Edit') ?
                  <div className={styles.status}>
                    <label htmlFor="Status">Status</label>
                    <Toggle data-automation-id="input-create-add-discount-status" onClick={() => this.ToggleStatus()} defaultToggled={this.state.IsActive} />
                  </div>
                : null }
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className={styles.buttonFooter}>
                  <Button
                    data-automation-id="btn-create-add-discount-submit"
                    type="submit"
                    onClick={() => {
                      if (!this.state.codeInput) {
                        this.setState({ errorCodeInput: 'Please enter code' });
                      }
                    }}
                  >Save</Button>
                  <Button data-automation-id="btn-create-add-discount-cancel" type="button" btnStyle="negative" onClick={() => this.props.history.push('/CBAdmin/DiscountDashBoard')}>Cancel</Button>
                </div>
              </Col>
            </Row>
          </form>
          {popup}
        </Box>
        { this.state.loading && <Loading /> }
      </Layout>);
  }
}

CreateEditDiscount.propTypes = {
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'CreateEditDiscount',
  validate: discountFormValidate,
})(CreateEditDiscount);
