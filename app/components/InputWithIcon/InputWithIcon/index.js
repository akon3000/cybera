import React, { PropTypes } from 'react';
import IconShop from 'react-icons/lib/md/store';
import IconLoading from 'react-icons/lib/fa/spinner';

import styles from './styles.css';

function InputWithIcon(props) {
  const Icon = props.icon;
  return (
    <div data-automation-id={props['data-automation-id']} className={`${styles.inputBox} ${props.error && props.isValidating ? styles.error : ''}`}>
      <span className={styles.icon}>
        <Icon />
      </span>
      <div className={styles.inputContainer}>
        {props.children}
        { props.isLoading && <IconLoading className={styles.loading} />}
      </div>
      { props.error && props.isValidating ? <div data-automation-id="error" className={styles.errorMessage}>{props.error}</div> : '' }
    </div>
  );
}

InputWithIcon.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.func,
  isValidating: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isLoading: PropTypes.bool,
  'data-automation-id': PropTypes.string,
};

InputWithIcon.defaultProps = {
  children: null,
  icon: IconShop,
  isValidating: false,
  error: false,
  isLoading: false,
  'data-automation-id': '',
};

export default InputWithIcon;
