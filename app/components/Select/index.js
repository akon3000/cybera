import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';

import styles from './styles.css';

class Select extends React.Component { // eslint-disable-line
  render() {
    const { input, label, disabled, defaultValue, onChange, hintText, icon, meta: { touched, error }, children, warning } = this.props; // eslint-disable-line
    return (
      <div className={`${styles.container} ${touched && error && styles.error}`} data-automation-id={this.props['data-automation-id']}>
        {label && <label htmlFor={input.name}>{label}</label> }
        {icon}
        <SelectField
          className={`${styles.selectField} ${icon && styles.iconField}`}
          labelStyle={{ fontSize: '0.85em' }}
          errorText={touched && error && <span data-automation-id="error">{error}</span>}
          {...input}
          hintText={hintText}
          onChange={(event, index, value) => input.onChange(value)}
          // children={children}
          value={input.value || defaultValue || ''}
          disabled={disabled}
          fullWidth={Boolean(true)}
        >
          {children}
        </SelectField>
      </div>
    );
  }
}

Select.propTypes = {
  'data-automation-id': PropTypes.string,
};

Select.defaultProps = {
  'data-automation-id': '',
};

export default Select;
