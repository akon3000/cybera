import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

class TextArea extends React.Component { // eslint-disable-line
  render() {
    const { input, rows, label, type, meta: { touched, error, warning } } = this.props; // eslint-disable-line
    return (
      <div className={`${styles.container} ${(touched && error) && styles.error}`} data-automation-id={this.props['data-automation-id']}>
        <label htmlFor={input.name}>{label}</label>
        <textarea {...input} rows={rows} type={type} />
        <br />
        {touched && ((error && <div data-automation-id="error" className={styles.errorMessage}>{error}</div>))}
      </div>
    );
  }
}

TextArea.propTypes = {
  'data-automation-id': PropTypes.string,
};

TextArea.defaultProps = {
  'data-automation-id': '',
};

export default TextArea;
