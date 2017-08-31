import React from 'react';
import PropTypes from 'prop-types';
import IconClose from 'react-icons/lib/md/close';
import { Row, Col } from 'react-flexbox-grid';
import { Field, reduxForm } from 'redux-form/immutable';
import MenuItem from 'material-ui/MenuItem';

import styles from './styles.css';
import Input from '../Input';
import Select from '../Select';
import CheckBox from '../CheckBox';
import InputMonthYear from '../InputMonthYear';
import visaIcon from './visa-icon.jpg';
import { apiUrl } from '../../config';
import request from '../../utils/request';
import validate from '../../utils/validate';
import message from '../../Message';
import ErrorBox from '../ErrorBox';
import Loading from '../Loading';

export const paymentValidate = (valuesBefore) => {
  const values = valuesBefore;
  const errors = {};
  const requiredFields = {
    IsBillingCyclePerMonth(value) {
      if (!value) return message.format('require_choose', 'billing cycle');
      const maxLength = validate.isValidLength(value, 25, 'Billing cycle');
      if (maxLength !== true) return maxLength;
      const notSpecialChar = validate.notSpecialChar(value);
      if (notSpecialChar !== true) return notSpecialChar;
      return true;
    },
    ExpDate(value) {
      if (!value) return message.format('require_enter', 'card expiry date');
      let temp = value.split('/').join('');
      temp = temp.split(' ').join('');
      const maxLength = validate.isValidLength(temp, 7, 'Card expiry date');
      if (maxLength !== true) return maxLength;
      if (!validate.matchExpiry(value)) return message.format('not_valid', 'card expiry date');
      return true;
    },
    CardHolderName(value) {
      if (!value) return message.format('require_enter', 'name on the card');
      const maxLength = validate.isValidLength(value, 50, 'Name on the card');
      if (maxLength !== true) return maxLength;
      const matchName = validate.matchName(value);
      if (matchName !== true) return matchName;
      return true;
    },
    CardNo(value) {
      if (!value) return message.format('require_enter', 'the card number');
      const maxLength = validate.isValidLength(value, 16, 'Card number');
      if (maxLength !== true) return maxLength;
      if (!validate.matchCard(value)) return message.format('not_valid', 'card number');
      return true;
    },
    CVN(value) {
      if (!value) return message.format('require_enter', 'the CCV');
      const maxLength = validate.isValidLength(value, 4, 'CCV');
      if (maxLength !== true) return maxLength;
      if (!validate.matchCard(value)) return message.format('not_valid', 'CCV');
      return true;
    },
  };

  for (const [field, fc] of Object.entries(requiredFields)) { // eslint-disable-line
    const msg = fc(values.get(field));
    if (msg !== true) errors[field] = msg;
  }

  return errors;
};

class PaymentPopup extends React.Component {
  constructor(props) {
    super(props);

    let showBillingCycle = true;
    let showAutoRenewal = true;

    if (this.props.isEnableAutoRenewal) {
      showBillingCycle = false;
      showAutoRenewal = false;
    }

    const website = localStorage.getItem('website') ? JSON.parse(localStorage.getItem('website')) : null;

    let templateName = '';
    if (this.props.template) {
      templateName = this.props.template.Name;
    } else if (website) {
      templateName = website.Template.Name;
    }

    let planName = '';
    if (this.props.plan) {
      planName = this.props.plan.Name;
    }

    this.state = {
      isLoading: false,
      error: false,
      isAuto: props.isAuto,
      failCount: 0,
      showBillingCycle,
      showAutoRenewal,
      templateName,
      planName,
      website,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.signUpID) {
      this.props.change('signUpID', this.props.signUpID);
    } else if (this.props.websiteID) {
      this.props.change('websiteID', this.props.websiteID);
    }
    this.props.change('IsAuto', this.state.isAuto);
    if (this.props.billingCycle) {
      this.props.change('IsBillingCyclePerMonth', this.props.billingCycle);
    }
  }

  submit(values) {
    const tempDate = values.get('ExpDate').split(' ').join('').split('/');
    const month = tempDate[0] ? parseInt(tempDate[0], 10) : 0;
    const year = tempDate[1] ? parseInt(tempDate[1], 10) : 0;

    const datas = {
      CardHolderName: values.get('CardHolderName'),
      Currency: 'AUD',
      CardNo: values.get('CardNo'),
      ExpMonth: month < 10 ? `0${month}` : `${month}`,
      ExpYear: `${year}`,
      CVN: values.get('CVN'),
      IsAuto: values.get('IsAuto') || false,
      IsBillingCyclePerMonth: values.get('IsBillingCyclePerMonth') === 'Month',
      PlanId: this.props.plan.Id,
    };
    let API = '';

    if (values.get('signUpID')) {
      API = `${apiUrl}/Users/SignUpPurchases/${values.get('signUpID')}`;
    } else {
      API = `${apiUrl}/Websites/${values.get('websiteID')}/RenewSubscription`;
    }

    if (this.props.isChangePlan) {
      API = `${apiUrl}/Websites/${values.get('websiteID')}/PurchasePlan`;
    }

    if (this.props.isEnableAutoRenewal) {
      API = `${apiUrl}/Websites/${values.get('websiteID')}/MakeAutoRenewSubscription`;
    }

    if (!this.state.isLoading) {
      this.setState({ isLoading: true }, () => {
        request.put(
          API,
          datas,
          (response) => {
            if (!response.error) {
              this.props.onSuccess();
            } else {
              this.setState({
                error: response.error,
                isLoading: false,
                failCount: this.state.failCount + 1,
              });
            }
          });
      });
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit((values) => { this.submit(values); })} data-automation-id="form-payment">
        <div className={styles.background}>
          <div className={styles.box}>
            <div key="Popup_Title" className={styles.titleBox}>
              { this.props.title }
              <button data-automation-id="btn-close" className={styles.closeButton} type="button" onClick={this.props.onClose}><IconClose /></button>
            </div>
            <div className={styles.body}>
              <Row>
                { this.state.error && this.state.failCount < 3 &&
                  <Col xs={12} style={{ textAlign: 'center', padding: '15px' }}>
                    <ErrorBox data-automation-id="error-box" error={this.state.error} onClose={() => { this.setState({ error: false }); }} />
                  </Col>
                }
                { this.state.failCount >= 3 &&
                  <Col xs={12} style={{ textAlign: 'center', padding: '15px' }}>
                    <ErrorBox
                      data-automation-id="error-box"
                      error={'Seems to be issue with your credit card. Please contact your credit card provider.'}
                    />
                  </Col>
                }
                <Col xs={12}>
                  <div className={styles.boxPadding}>
                    <p><strong>Template : </strong> {this.state.templateName}</p>
                    <p><strong>Plan : </strong>{this.state.planName}</p>
                  </div>
                </Col>
                <Col xs={12}>
                  <Field
                    label="Please choose billing cycle"
                    name="IsBillingCyclePerMonth"
                    data-automation-id="select-billing-cycle"
                    component={Select}
                    disabled={!this.state.showBillingCycle}
                  >
                    <MenuItem value={'Month'} primaryText={<div className={styles.selectItems}><span className={styles.selectText}>Monthly</span><small>{`$${this.props.plan.Price}`}</small></div>} />
                    <MenuItem value={'Year'} primaryText={<div className={styles.selectItems}><span className={styles.selectText}>Yearly</span><small>{`$${this.props.plan.PricePerYear}`}</small></div>} />
                  </Field>
                </Col>
                <Col sm={12} xs={12}>
                  <div className={styles.boxPadding}>
                    <img src={visaIcon} alt="Visa Icon" data-automation-id="image-credit-card" />
                  </div>
                </Col>
                <Col sm={6} xs={12}>
                  <Field label="Name on the card" name="CardHolderName" type="text" component={Input} data-automation-id="input-credit-card-name" />
                </Col>
                <Col sm={6} xs={12}>
                  <Field label="Card number" name="CardNo" type="text" component={Input} data-automation-id="input-credit-card-number" />
                </Col>
                <Col xs={6}>
                  <Field label="CCV" name="CVN" type="text" component={Input} data-automation-id="input-credit-card-ccv" />
                </Col>
                <Col xs={6}>
                  <Field
                    label="Expiry Date"
                    name="ExpDate"
                    data-automation-id="input-credit-card-expiry-date"
                    component={InputMonthYear}
                  />
                </Col>
                {this.state.showAutoRenewal &&
                  <Col xs={12}>
                    <div className={styles.buttonFooter}>
                      <Row>
                        <Col sm={9} xs={12}>
                          <Field
                            label="I would like to set up my account for automatic renewal"
                            data-automation-id="checkbox-account-automatic-renewal"
                            name="IsAuto" type="text" component={CheckBox}
                            checked={this.state.isAuto}
                            onCheck={(value) => {
                              this.setState({ isAuto: value });
                              this.props.change('IsAuto', value);
                            }}
                          />
                        </Col>
                        <Col sm={3} xs={12} className={styles.submitContainer}>
                          <button data-automation-id="btn-submit" type="submit">Submit</button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                }
                {!this.state.showAutoRenewal &&
                  <Col xs={12}>
                    <div className={styles.buttonFooter}>
                      <Row>
                        <Col sm={9} xs={12}>
                          <Field
                            label="I would like to set up my account for automatic renewal"
                            data-automation-id="checkbox-account-automatic-renewal"
                            name="IsAuto" type="text" component={CheckBox}
                            checked={Boolean(true)}
                            disabled={Boolean(true)}
                            onCheck={(value) => {
                              this.setState({ isAuto: value });
                              this.props.change('IsAuto', value);
                            }}
                          />
                        </Col>
                        <Col sm={3} xs={12} className={styles.submitContainer}>
                          <button data-automation-id="btn-submit" type="submit">Submit</button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                }
              </Row>
            </div>
            { this.state.isLoading && <Loading /> }
          </div>
        </div>
      </form>
    );
  }
}

PaymentPopup.propTypes = {
  signUpID: PropTypes.number,
  websiteID: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  plan: PropTypes.object.isRequired,
  template: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  isAuto: PropTypes.bool,
  billingCycle: PropTypes.string,
  isChangePlan: PropTypes.bool,
  title: PropTypes.string,
  isEnableAutoRenewal: PropTypes.bool,
};

PaymentPopup.defaultProps = {
  signUpID: null,
  websiteID: null,
  template: null,
  isAuto: false,
  isMakeAutoRenew: PropTypes.bool,
  billingCycle: null,
  isChangePlan: false,
  title: 'Payment',
  isEnableAutoRenewal: false,
};

export default reduxForm({ // eslint-disable-line
  form: 'PaymentPopup', // a unique name for this form
  validate: paymentValidate,                // <--- validation function given to redux-form
})(PaymentPopup);
