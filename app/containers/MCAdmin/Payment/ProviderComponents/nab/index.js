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
import nabIcon from '../../../../../assets/icon-payment-provider/nab.jpg';

class Nab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      providerName: 'NAB',
      confirmRemove: false,
      NabHasRange: this.props.data !== null ? this.props.data.NabHasRange : false,
    };
  }

  componentDidMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.props.initialize({
        paymentGroup: nextProps.data.NabHasRange,
        ClientID: nextProps.data.NabClientID,
        TransactionPassword: nextProps.data.NabTransactionPassword,
        PriceFrom: nextProps.data.NabRangeFrom === 0 ? nextProps.data.NabRangeFrom.toString() : nextProps.data.NabRangeFrom,
        PriceTo: nextProps.data.NabRangeTo === 0 ? nextProps.data.NabRangeTo.toString() : nextProps.data.NabRangeTo,
      });
    }
  }

  onClose() {
    this.initData();
    this.setState({
      NabHasRange: this.props.data !== null ?
      this.props.data.NabHasRange : false,
    });
    this.props.onClose();
  }

  onRemove() {
    if (this.props.data !== null) {
      this.setState({ loading: true });
      request.delete(`${apiUrl}/Websites/${localStorage.websiteID}/Payments/Nab`, {}, (response) => {
        this.setState({ loading: false }, () => this.props.onRemove(this.props.name, response));
      });
    } else {
      this.props.onRemove(this.props.name);
    }
  }

  onSubmit(value) {
    this.setState({ loading: true });
    const data = {
      NabClientID: value.get('ClientID'),
      NabTransactionPassword: value.get('TransactionPassword'),
      NabHasRange: value.get('paymentGroup'),
    };

    if (value.get('PriceFrom') !== null && value.get('paymentGroup')) data.NabRangeFrom = value.get('PriceFrom');
    if (value.get('PriceTo') !== null && value.get('paymentGroup')) data.NabRangeTo = value.get('PriceTo');

    if (this.props.data !== null) {
      request.put(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Payments/Nab`, data, (response) => {
        this.setState({ loading: false }, () => this.props.onSubmit(this.props.name, response, this.state.providerName));
      });
    } else {
      request.post(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Payments/Nab`, data, (response) => {
        this.setState({ loading: false }, () => this.props.onSubmit(this.props.name, response, this.state.providerName));
      });
    }
  }

  initData() {
    if (this.props.data !== null) {
      this.props.initialize({
        paymentGroup: this.props.data.NabHasRange,
        ClientID: this.props.data.NabClientID,
        TransactionPassword: this.props.data.NabTransactionPassword,
        PriceFrom: this.props.data.NabRangeFrom === 0 ? this.props.data.NabRangeFrom.toString() : this.props.data.NabRangeFrom,
        PriceTo: this.props.data.NabRangeTo === 0 ? this.props.data.NabRangeTo.toString() : this.props.data.NabRangeTo,
      });
    } else {
      this.props.initialize({
        paymentGroup: false,
        ClientID: null,
        TransactionPassword: null,
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
      <div className={styles.container} data-automation-id="option-nab">

        { this.props.data !== null &&
          <Box className={styles.box}>
            <Row middle="xs">
              <Col xs={8} sm={8} md={9} lg={9} className={styles.settingIcon}>
                <img alt="nab" src={nabIcon} />
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

        <Dialog onClose={() => this.onClose()} title={this.state.providerName} open={this.props.open}>
          <Row className={styles.containerPopup}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <Col lg={8} className={styles.providerIcon}>
                  <img alt="nab" src={nabIcon} />
                </Col>
                <Col lg={4} className={styles.providerLink}>
                  <a data-automation-id="link-to-nab" target="_blank" href="https://www.nab.com.au">
                    Visit website for more info
                  </a>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <form onSubmit={this.props.handleSubmit((value) => this.onSubmit(value))} data-automation-id="form-nab">
                <Row className={styles.row}>
                  <Col xs={7} sm={7} md={5} lg={5}>
                    <Field label="Client Id" name="ClientID" type="text" component={input} data-automation-id="input-client-id" />
                  </Col>
                  <Col xs={7} sm={7} md={5} lg={5}>
                    <Field label="Transaction Password" name="TransactionPassword" type="password" component={input} autoComplete="new-password" data-automation-id="input-transaction-password" />
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col xs={7} sm={7} md={5} lg={5}>
                    <Field
                      noneline
                      onChange={(event, value) => this.setState({ NabHasRange: value })}
                      data-automation-id="radio-group-payment-range"
                      label="Accepted Payment Range"
                      name="paymentGroup"
                      component={RadioGroup}
                    >{paymentGroup}</Field>
                  </Col>
                </Row>
                {
                  this.state.NabHasRange &&
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
    ClientID(value) {
      if (!value) return message.format('require_enter', 'client id');
      if (value.length !== 7) return 'Client id is required 7 characters';
      if (!/^[a-zA-Z0-9]*$/.test(value)) return message.error.ALPHANUMERIC;
      return true;
    },
    TransactionPassword(value) {
      if (!value) return message.format('require_enter', 'transaction password');
      const maxLength = Validate.isValidLength(value, 24, 'Transaction password');
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

Nab.propTypes = {
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

Nab.defaultProps = {
  data: null,
  open: false,
};

export default reduxForm({
  form: 'Nab',
  validate,
})(Nab);
