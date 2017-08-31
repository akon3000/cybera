import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import styles from './styles.css';

function Input (props) { // eslint-disable-line
  const { input, label, disabled, defaultValue, type, hintText, autoComplete, icon, meta: { touched, error } } = props; // eslint-disable-line
  return (
    <div
      data-automation-id={props['data-automation-id']} // eslint-disable-line
      className={`${styles.container}`}
    >
      <label htmlFor={input.name}>{label}</label>
      <TextField
        className={styles.textField}
        errorText={touched && error && <span data-automation-id="error">{error}</span>}
        {...input}
        value={input.value || defaultValue || ''}
        disabled={disabled}
        type={type}
        hintText={hintText}
        underlineStyle={{ borderColor: '#D7D7D7' }}
        errorStyle={{ color: '#F44336' }}
        // autoComplete={autoComplete}
      />
    </div>
  );
}

Input.propTypes = {
  'data-automation-id': PropTypes.string,
};

Input.defaultProps = {
  'data-automation-id': '',
};

export default Input;
