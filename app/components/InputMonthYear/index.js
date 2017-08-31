import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import styles from './styles.css';

class InputMonthYear extends Component { // eslint-disable-line

  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  onChange(event) {
    let inputValue = event.target.value;
    if (inputValue.length === 2
        && inputValue.length > this.state.value.length
        && inputValue[inputValue.length - 1] !== '/') {
      if (inputValue > 12) {
        inputValue = `0${inputValue[0]} / ${inputValue[1]}`;
      } else {
        inputValue += ' / ';
      }
    }

    if (inputValue[inputValue.length - 1] === '/'
        && this.state.value.indexOf('/') > 0
        && inputValue.length > this.state.value.length) {
      // do not things
    } else if (inputValue[inputValue.length - 1] === '/'
        && this.state.value.indexOf('/') === -1
        && inputValue.length > this.state.value.length) {
      inputValue = inputValue.replace('/', ' / ');
      this.setState({ value: inputValue });
    } else {
      this.setState({ value: inputValue });
    }
  }

  render() {
    const { input, label, type, hintText, icon, meta: { touched, error } } = this.props; // eslint-disable-line

    return (
      <div className={`${styles.container}`} data-automation-id={this.props['data-automation-id']}>
        <label htmlFor={input.name}>{label}</label>
        <TextField
          className={styles.textField}
          errorText={touched && error && <span data-automation-id="error">{error}</span>}
          {...input}
          type={type}
          hintText="MM/YYYY"
          value={this.state.value}
          onChange={(event) => this.onChange(event)}
        />
      </div>
    );
  }
}

InputMonthYear.propTypes = {
  'data-automation-id': PropTypes.string,
};

InputMonthYear.defaultProps = {
  'data-automation-id': '',
};

export default InputMonthYear;
