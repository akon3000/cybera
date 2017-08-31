import React from 'react';
import PropTypes from 'prop-types';
import { RadioButtonGroup } from 'material-ui/RadioButton';

import styles from './styles.css';

class RadioGroup extends React.Component { // eslint-disable-line
  render() {
    const { input, children, label, type, meta: { touched, error, warning }, noneline } = this.props; // eslint-disable-line
    return (
      <div
        data-automation-id={this.props['data-automation-id']} // eslint-disable-line
        className={`${styles.container} ${touched && error && styles.error}`}
      >
        <label htmlFor={input.name}>{label}</label>
        <RadioButtonGroup
          {...input}
          valueSelected={input.value}
          onChange={(event, value) => input.onChange(value)}
          className={`${styles.radioGroup} ${!noneline ? styles.inline : ''}`}
        >
          {React.Children.toArray(children)}
        </RadioButtonGroup>
        {touched && error &&
          <div
            data-automation-id="error" // eslint-disable-line
            className={styles.errorText}
          >{error}</div>
        }
      </div>
    );
  }
}

RadioGroup.propTypes = {
  'data-automation-id': PropTypes.string,
};

RadioGroup.defaultProps = {
  'data-automation-id': '',
};

export default RadioGroup;
