import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

function Box({ children, className }) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}

Box.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Box.defaultProps = {
  className: '',
};

export default Box;
