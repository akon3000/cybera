import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';

import styles from './styles.css';

class CheckBox extends React.Component { // eslint-disable-line
  render() {
    const { input, children, label, type, checked, disabled, onCheck, meta: { touched, error, warning } } = this.props; // eslint-disable-line
    return (
      <div className={`${styles.container}`} data-automation-id={this.props['data-automation-id']}>
        <Checkbox
          {...input}
          onCheck={(event, value) => onCheck(value)}
          label={label}
          checked={checked}
          disabled={disabled}
        />
      </div>
    );
  }
}

CheckBox.propTypes = {
  'data-automation-id': PropTypes.string,
};

CheckBox.defaultProps = {
  'data-automation-id': '',
};

export default CheckBox;
