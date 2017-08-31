import React from 'react';
import TextField from 'material-ui/TextField';

import styles from './styles.css';

function InputReduxWithIcon({ input, label, type, hintText, icon, meta: { touched, error }}) { // eslint-disable-line
  return (
    <div className={`${styles.textField}`}>
      {icon}
      <TextField
        errorText={touched && error}
        errorStyle={{ textAlign: 'left' }}
        {...input}
        type={type}
        hintText={hintText}
      />
    </div>
  );
}

export default InputReduxWithIcon;
