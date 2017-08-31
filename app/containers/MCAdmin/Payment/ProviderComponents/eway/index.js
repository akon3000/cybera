import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Map } from 'immutable';
import { Field, reduxForm } from 'redux-form/immutable';

import styles from '../styles.css';
import Box from '../../../../../components/AdminLayout/components/Box';
import Validate from '../../../../../utils/validate';
import Loading from '../../../../../components/Loading';
import Button from '../../../../../components/Button';
import input from '../../../../../components/Input';
import RadioGroup from '../../../../../components/RadioGroup';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';
import message from '../../../../../Message';
import Dialog from '../../../../../components/Dialog';
import ConfirmPopup from '../../../../../components/ConfirmPopup';
import ewayIcon from '../../../../../assets/icon-payment-provider/eway.jpg';

class Eway extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      providerName: 'eWay',
      confirmRemove: false,
      ewayHasRange: this.props.data !== null ? this.props.data.ewayHasRange : false,
    };
  }

  componentDidMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.props.initialize({
        paymentGroup: nextProps.data.ewayHasRange,
        AccountName: nextProps.data.eWayAccountName,
        ApiKey: nextProps.data.eWayApiKey,
        ApiPass: nextProps.data.eWayApiPass,
        ClientKey: nextProps.data.eWayClientKey,
        PriceFrom: nextProps.data.ewayRangeFrom === 0 ? nextProps.data.ewayRangeFrom.toString() : nextProps.data.ewayRangeFrom,
        PriceTo: nextProps.data.ewayRangeTo === 0 ? nextProps.data.ewayRangeTo.toString() : nextProps.data.ewayRangeTo,
      });
    }
  }

  onClose() {
    this.initData();
    this.setState({
      ewayHasRange: this.props.data !== null ?
      this.props.data.ewayHasRange : false,
    });
    this.props.onClose();
  }

  onRemove() {
    if (this.props.data !== null) {
      this.setState({ loading: true });
      request.delete(`${apiUrl}/Websites/${localStorage.websiteID}/Payments/eWay`, {}, (response) => {
        this.setState({ loading: false }, () => this.props.onRemove(this.props.name, response));
      });
    } else {
      this.props.onRemove(this.props.name);
    }
  }

  onSubmit(value) {
    this.setState({ loading: true });
    const data = {
      eWayAccountName: value.get('AccountName'),
      eWayApiKey: value.get('ApiKey'),
      eWayApiPass: value.get('ApiPass'),
      eWayClientKey: value.get('ClientKey'),
      ewayHasRange: value.get('paymentGroup'),
    };

    if (value.get('PriceFrom') !== null && value.get('paymentGroup')) data.ewayRangeFrom = value.get('PriceFrom');
    if (value.get('PriceTo') !== null && value.get('paymentGroup')) data.ewayRangeTo = value.get('PriceTo');

    if (this.props.data !== null) {
      request.put(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Payments/eWay`, data, (response) => {
        this.setState({ loading: false }, () => this.props.onSubmit(this.props.name, response, this.state.providerName));
      });
    } else {
      request.post(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Payments/eWay`, data, (response) => {
        this.setState({ loading: false }, () => this.props.onSubmit(this.props.name, response, this.state.providerName));
      });
    }
  }

  initData() {
    if (this.props.data !== null) {
      this.props.initialize({
        paymentGroup: this.props.data.ewayHasRange,
        AccountName: this.props.data.eWayAccountName,
        ApiKey: this.props.data.eWayApiKey,
        ApiPass: this.props.data.eWayApiPass,
        ClientKey: this.props.data.eWayClientKey,
        PriceFrom: this.props.data.ewayRangeFrom === 0 ? this.props.data.ewayRangeFrom.toString() : this.props.data.ewayRangeFrom,
        PriceTo: this.props.data.ewayRangeTo === 0 ? this.props.data.ewayRangeTo.toString() : this.props.data.ewayRangeTo,
      });
    } else {
      this.props.initialize({
        paymentGroup: false,
        AccountName: null,
        ApiKey: null,
        ApiPass: null,
        ClientKey: null,
        PriceFrom: null,
        PriceTo: null,
      });
    }
  }

  render() {
    const paymentGroup = [
      <radio key="AcceptAll" value={Boolean(false)} label="Accept all ranges" />,
      <radio key="AcceptRange" value={Boolean(true)} label="Set payment range" />,
    ];
    return (
      <div className={styles.container} data-automation-id="option-eway">

        { this.props.data !== null &&
          <Box className={styles.box}>
            <Row middle="xs">
              <Col xs={8} sm={8} md={9} lg={9} className={styles.settingIcon}>
                <img alt="eWay" src={ewayIcon} />
              </Col>
              <Col xs={4} sm={4} md={3} lg={3} className={styles.settingAndRemove}>
                <button data-automation-id="btn-account-setting" onClick={() => this.props.onOpen()}>Account Setting</button> | <button data-automation-id="btn-remove" onClick={() => this.setState({ confirmRemove: true })}>Remove</button>
              </Col>
            </Row>
            { this.state.loading && !this.props.open && <Loading inside /> }
          </Box>
        }

        { this.state.confirmRemove &&
          <ConfirmPopup
            data-automation-id={`popup-confirm-remove-${this.state.providername}`}
            onClose={() => this.setState({ confirmRemove: false })}
            actions={[
              <Button
                key="Yes"
                data-automation-id="btn-confirm-remove-yes"
                onClick={() => this.setState({ confirmRemove: false }, this.onRemove)}
              >Yes</Button>,
              <Button
                key="No"
                btnStyle="negative"
                data-automation-id="btn-confirm-remove-no"
                onClick={() => this.setState({ confirmRemove: false })}
              >No</Button>,
            ]}
          >
            <Row>
              <Col xs={12}>Are you sure to remove the payment provider?</Col>
            </Row>
          </ConfirmPopup>
        }

        <Dialog onClose={() => this.onClose()} title={<div style={{ textTransform: 'initial' }}>{this.state.providerName}</div>} open={this.props.open}>
          <Row className={styles.containerPopup}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <Col lg={8} className={styles.providerIcon}>
                  <img alt="eWay" src={ewayIcon} />
                </Col>
                <Col lg={4} className={styles.providerLink}>
                  <a data-automation-id="link-to-eway" target="_blank" href="https://www.eway.com.au/">
                    Visit website for more info
                  </a>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <form onSubmit={this.props.handleSubmit((value) => this.onSubmit(value))} data-automation-id="form-eway">
                <Row className={styles.row}>
                  <Col xs={7} sm={7} md={5} lg={5}>
                    <Field label="Account Name" name="AccountName" type="text" component={input} data-automation-id="input-account-name" />
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col xs={7} sm={7} md={5} lg={5}>
                    <Field label="Api Key" name="ApiKey" type="text" component={input} data-automation-id="input-api-key" />
                  </Col>
                  <Col xs={7} sm={7} md={5} lg={5}>
                    <Field label="Api Password" name="ApiPass" type="password" component={input} autoComplete="new-password" data-automation-id="input-api-password" />
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col xs={7} sm={7} md={10} lg={10}>
                    <Field label="Client Side Encryption Key" name="ClientKey" type="text" component={input} autoComplete="new-password" data-automation-id="input-client-key" />
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col xs={7} sm={7} md={5} lg={5}>
                    <Field
                      noneline
                      onChange={(event, value) => this.setState({ ewayHasRange: value })}
                      data-automation-id="radio-group-payment-range"
                      label="Accepted Payment Range"
                      name="paymentGroup"
                      component={RadioGroup}
                    >{paymentGroup}</Field>
                  </Col>
                </Row>
                {
                  this.state.ewayHasRange &&
                  <Row>
                    <Col xs={7} sm={7} md={5} lg={5}>
                      <Field label="From" name="PriceFrom" type="text" component={input} data-automation-id="input-rang-from" />
                    </Col>
                    <Col xs={5} sm={5} md={1} lg={1} style={{ paddingTop: '35px' }}>$</Col>
                    <Col xs={7} sm={7} md={5} lg={5}>
                      <Field label="To" name="PriceTo" type="text" component={input} data-automation-id="input-rang-to" />
                    </Col>
                    <Col xs={5} sm={5} md={1} lg={1} style={{ paddingTop: '35px' }}>$</Col>
                  </Row>
                }
                <div className={styles.containerAction}>
                  <Button type="submit" data-automation-id="btn-save">Save</Button>
                  <Button
                    type="button"
                    data-automation-id="btn-cancel"
                    btnStyle="negative"
                    onClick={() => this.onClose()}
                  >Cancel</Button>
                </div>
              </form>
            </Col>
          </Row>
          { this.state.loading && <Loading inside /> }
        </Dialog>

      </div>
    );
  }
}

const validate = (values) => {
  if (!Map.isMap(values)) return {};

  const errors = {};
  const requiredFields = {
    AccountName(value) {
      if (!value) return message.format('require_enter', 'account name');
      const maxLength = Validate.isValidLength(value, 50, 'Account name');
      if (maxLength !== true) return maxLength;
      return true;
    },
    ApiKey(value) {
      if (!value) return message.format('require_enter', 'api key');
      const maxLength = Validate.isValidLength(value, 100, 'Api key');
      if (maxLength !== true) return maxLength;
      return true;
    },
    ApiPass(value) {
      if (!value) return message.format('require_enter', 'api password');
      const maxLength = Validate.isValidLength(value, 100, 'Api password');
      if (maxLength !== true) return maxLength;
      return true;
    },
    ClientKey(value) {
      if (!value) return message.format('require_enter', 'client side encryption key');
      const maxLength = Validate.isValidLength(value, 500, 'Client side encryption key');
      if (maxLength !== true) return maxLength;
      return true;
    },
  };

  Object.keys(requiredFields).forEach((key) => {
    const msg = requiredFields[key](values.get(key));
    if (msg !== true) errors[key] = msg;
  });

  if (values.get('paymentGroup')) { // <-- user select Set payment range.
    const priceFrom = values.get('PriceFrom');
    const priceTo = values.get('PriceTo');
    const validatePriceFrom = Validate.matchRange(priceFrom);
    const validatePriceTo = Validate.matchRange(priceTo);

    if (!priceFrom) {
      errors.PriceFrom = message.format('require_enter', 'payment range from amount');
    } else if (validatePriceFrom !== true) {
      errors.PriceFrom = validatePriceFrom;
    }
    if (!priceTo) {
      errors.PriceTo = message.format('require_enter', 'payment range to amount');
    } else if (validatePriceTo !== true) {
      errors.PriceTo = validatePriceTo;
    }

    if (!errors.PriceFrom && !errors.PriceTo) {
      if (parseFloat(priceFrom, 10) > parseFloat(priceTo, 10)) {
        errors.PriceFrom = message.error.PAYMENT_RANGE_FROM;
        errors.PriceTo = message.error.PAYMENT_RANGE_TO;
      }
    }
  }
  return errors;
};

Eway.propTypes = {
  onRemove: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
  open: PropTypes.bool,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

Eway.defaultProps = {
  data: null,
  open: false,
};

export default reduxForm({
  form: 'Eway',
  validate,
})(Eway);
