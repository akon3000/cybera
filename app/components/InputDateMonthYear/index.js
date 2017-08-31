import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import styles from './styles.css';

class InputDateMonthYear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      valueValid: false,
    };
  }

  onChange(event) {
    let inputValue = event.target.value;
    if (inputValue.length > 0 && !/^[\/0-9]+$/.test(inputValue)) { // eslint-disable-line
      return;
    }
    if (inputValue.length === 1 && inputValue.length > this.state.value.length && inputValue[inputValue.length - 1] === '/') {
      inputValue = '01/';
    }
    if (inputValue.length === 3 && inputValue.length > this.state.value.length && inputValue[inputValue.length - 1] !== '/') {
      inputValue = `${inputValue.slice(0, 2)}/${inputValue[2]}`;
    }
    if (inputValue.length === 4 && inputValue.length > this.state.value.length && inputValue[inputValue.length - 1] === '/') {
      inputValue = `${inputValue.slice(0, 3)}01/`;
    }
    if (inputValue.length === 2 && inputValue.length > this.state.value.length) {
      if (inputValue[inputValue.length - 1] !== '/') {
        inputValue = inputValue !== '00' ? `${inputValue}/` : '01/';
      } else {
        inputValue = inputValue !== '0/' ? `0${inputValue[inputValue.length - 2]}/` : '01/';
      }
    }
    if (inputValue.length === 5 && inputValue.length > this.state.value.length) {
      if (inputValue[inputValue.length - 1] !== '/') {
        inputValue = inputValue.slice(3, 5) !== '00' ?
        `${inputValue.slice(0, 3)}${inputValue.slice(3, 5)}/` : `${inputValue.slice(0, 3)}01/`;
      } else {
        inputValue = inputValue.slice(3, 5) !== '0/' ?
        `${inputValue.slice(0, 3)}0${inputValue[inputValue.length - 2]}/` : `${inputValue.slice(0, 3)}01/`;
      }
    }
    if (inputValue.length > 6 && inputValue[inputValue.length - 1] === '/') {
      inputValue = this.state.value;
    }
    if (inputValue.length > 10) {
      inputValue = this.state.value;
    }

    this.setState({ value: inputValue, valueValid: true });
  }

  render() {
    const { input, label, type, hintText, icon, meta: { touched, error } } = this.props; // eslint-disable-line

    return (
      <div className={`${styles.container}`} data-automation-id={this.props['data-automation-id']}>
        <label htmlFor={input.name}>{label}</label>
        <TextField
          className={styles.textField}
          ref={(node) => { this.inputDateMonthYear = node; }}
          errorText={touched && error && <span data-automation-id="error">{error}</span>}
          {...input}
          type={type}
          hintText="DD/MM/YYYY"
          value={this.state.valueValid ? this.state.value : input.value}
          onChange={(event) => this.onChange(event)}
          onKeyDown={(event) => {
            if (event.keyCode === 32) event.preventDefault();
          }}
        />
      </div>
    );
  }
}

InputDateMonthYear.propTypes = {
  'data-automation-id': PropTypes.string,
};

InputDateMonthYear.defaultProps = {
  'data-automation-id': '',
};

export default InputDateMonthYear;
