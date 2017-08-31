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

class GetInTouchForm extends Component {
  constructor() {
    super();
    this.state = {
      getInTouchPopupShow: false,
      ErrorPopupShow: false,
      enterName: '',
      enterEmail: '',
      enterEnquiry: '',
      ErrorMessageName: '',
      ErrorMessageEmail: '',
      ErrorMessageEnquiry: '',
      responseError: '',
    };
  }

  handleNameChange(evt) {
    this.setState({
      enterName: evt.target.value,
      ErrorMessageName: '',
    });
  }

  handleEmailChange(evt) {
    this.setState({
      enterEmail: evt.target.value,
      ErrorMessageEmail: '',
    });
  }

  handleEnquiryChange(evt) {
    this.setState({
      enterEnquiry: evt.target.value,
      ErrorMessageEnquiry: '',
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const errors = {};
    const requiredFields = {
      enterName(value) {
        if (!value) return message.format('require_enter', 'name');
        const maxLength = validate.isValidLength(value, 100, 'Name');
        if (maxLength !== true) return maxLength;
        const notNumeric = validate.notNumeric(value);
        if (notNumeric !== true) return notNumeric;
        if (!/^[a-zA-Z.'\-\s]+$/.test(value)) return message.format('special_char', ['-', "'", '.']);
        return true;
      },
      enterEnquiry(value) {
        if (!value) return message.format('require_enter', 'message');
        const maxLength = validate.isValidLength(value, 250, 'Message');
        if (maxLength !== true) return maxLength;
        return true;
      },
      enterEmail(value) {
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

    this.setState({
      ErrorMessageName: errors.enterName,
      ErrorMessageEmail: errors.enterEmail,
      ErrorMessageEnquiry: errors.enterEnquiry,
    });

    if (!errors.enterName && !errors.enterEnquiry && !errors.enterEmail) {
      request.post(
        `${apiUrl}/GetInTouch`,
        {
          Name: this.state.enterName,
          Email: this.state.enterEmail,
          Message: this.state.enterEnquiry,
        },
        (response) => {
          if (!response.error) {
            this.setState({
              enterName: '',
              enterEmail: '',
              enterEnquiry: '',
              getInTouchPopupShow: true,
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

    if (this.state.getInTouchPopupShow) {
      popup.push(
        <Popup
          title=""
          key="getInTouchMessagePopup"
          boxStyle={{ height: '100px', marginTop: '-200px', padding: '120px 60px' }}
          onClose={() => {
            this.setState({ getInTouchPopupShow: false });
          }}
          data-automation-id="popup-get-in-touch-success"
        >
          <div style={{ fontFamily: 'Lato', fontSize: '20px' }}>Thanks for contacting us. We will get in touch with you shortly.</div>
        </Popup>
      );
    }

    if (this.state.ErrorPopupShow) {
      popup.push(
        <ErrorPopup
          key="ResponseError"
          data-automation-id="popup-get-in-touch-error"
          error={this.state.responseError}
          onClose={() => { this.setState({ ErrorPopupShow: false }); }}
        />
      );
    }

    return (
      <div data-automation-id={this.props['data-automation-id']}>
        <form onSubmit={(evt) => this.handleSubmit(evt)} data-automation-id="form-get-in-touch">
          <div className={s.formContent}>
            <div data-automation-id="input-name" className={s.spaceBetweenInput1}>
              <input
                type="text"
                placeholder="Name"
                value={this.state.enterName}
                onChange={(evt) => this.handleNameChange(evt)}
              />
              <div className={s.hintText} data-automation-id="error">{this.state.ErrorMessageName}</div>
            </div>
            <div data-automation-id="input-email" className={s.spaceBetweenInput2}>
              <input
                type="text"
                placeholder="Email"
                value={this.state.enterEmail}
                onChange={(evt) => this.handleEmailChange(evt)}
              />
              <div className={s.hintText} data-automation-id="error">{this.state.ErrorMessageEmail}</div>
            </div>
            <div data-automation-id="textarea-message" className={s.spaceBetweenInput1}>
              <textarea
                style={{ resize: 'none' }}
                rows="5"
                placeholder="Message"
                value={this.state.enterEnquiry}
                onChange={(evt) => this.handleEnquiryChange(evt)}
              />
              <div className={s.hintText} data-automation-id="error">{this.state.ErrorMessageEnquiry}</div>
            </div>
            <Button data-automation-id="btn-send" style={{ backgroundColor: '#E48E32' }} type="submit">SEND</Button>
          </div>
        </form>
        {popup}
      </div>
    );
  }
}

GetInTouchForm.propTypes = {
  'data-automation-id': PropTypes.string,
};

GetInTouchForm.defaultProps = {
  'data-automation-id': '',
};

export default GetInTouchForm;
