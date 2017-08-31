import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

function ErrorBox(props) {
  const { error, style } = props;
  return (
    <span
      data-automation-id={props['data-automation-id']}
      className={`ErrorBox ${styles.box}`}
      style={style}
    >{error}</span>
  );
}

ErrorBox.propTypes = {
  error: PropTypes.string,
  style: PropTypes.object,
  'data-automation-id': PropTypes.string,
};

ErrorBox.defaultProps = {
  error: '',
  style: {},
  'data-automation-id': '',
};

export default ErrorBox;
