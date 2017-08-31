import React, { Component } from 'react';
import PropTypes from 'prop-types';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import Button from '../../../../components/Button';
import s from './styles.css';
import message from '../../../../Message';
import validate from '../../../../utils/validate';
import Popup from '../../../../components/Popup';
import ErrorPopup from '../../../../components/ErrorPopup';

class SubscribeForm extends Component { // eslint-disable-line
  constructor() {
    super();
    this.state = {
      subscribePopupShow: false,
      ErrorPopupShow: false,
      enterValue: '',
      emailErrorMessage: '',
      responseError: '',
    };
  }

  handleChange(evt) {
    this.setState({
      enterValue: evt.target.value,
      emailErrorMessage: '',
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.setState({ emailErrorMessage: '' });

    const errors = {};
    const requiredFields = {
      enterValue(value) {
        if (!value) return message.format('require_enter', 'email address');
        const maxLength = validate.isValidLength(value, 100, 'Email address');
        if (maxLength !== true) return maxLength;
        if (!validate.isEmail(value)) return message.error.NOT_VALID_EMAIL;
        return true;
      },
    };

    for (const [field, fc] of Object.entries(requiredFields)) { // eslint-disable-line
      const msg = fc(this.state[field]);
      if (msg !== true) errors[field] = msg;
    }

    if (errors.enterValue) {
      this.setState({ emailErrorMessage: errors.enterValue });
    } else {
      request.post(
        `${apiUrl}/SubscriptionEmail?Email=${this.state.enterValue}`,
        {},
        (response) => {
          if (!response.error) {
            this.setState({
              subscribePopupShow: true,
              enterValue: '',
            });
          } else {
            this.setState({
              ErrorPopupShow: true,
              responseError: response.error,
            });
          }
        }
      );
    }
  }

  render() {
    const popup = [];

    if (this.state.subscribePopupShow) {
      popup.push(
        <Popup
          title=""
          key="SubscriptionMessagePopup"
          boxStyle={{ height: '100px', marginTop: '-200px', padding: '120px 60px' }}
          onClose={() => {
            this.setState({ subscribePopupShow: false });
          }}
          data-automation-id="popup-subscribe-success"
        >
          <div style={{ fontFamily: 'Lato', fontSize: '20px' }}>Thanks for subscribing</div>
        </Popup>
      );
    }

    if (this.state.ErrorPopupShow) {
      popup.push(
        <ErrorPopup
          key="ResponseError"
          data-automation-id="popup-subscribe-error"
          error={this.state.responseError}
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    return (
      <div data-automation-id={this.props['data-automation-id']}>
        <form onSubmit={(evt) => this.handleSubmit(evt)} data-automation-id="form-subscribe">
          <div className={s.formContent} data-automation-id="input-email">
            <input
              type="text"
              placeholder="Enter Email Address"
              value={this.state.enterValue}
              onChange={(evt) => this.handleChange(evt)}
            />
            <div className={s.hintTextMobile} data-automation-id="error">{this.state.emailErrorMessage}</div>
            <Button data-automation-id="btn-subscribe" style={{ backgroundColor: '#E48E32' }} type="submit">SUBSCRIBE</Button>
            <div className={s.hintText} data-automation-id="error">{this.state.emailErrorMessage}</div>
          </div>
        </form>
        {popup}
      </div>
    );
  }
}

SubscribeForm.propTypes = {
  'data-automation-id': PropTypes.string,
};

SubscribeForm.defaultProps = {
  'data-automation-id': '',
};

export default SubscribeForm;
