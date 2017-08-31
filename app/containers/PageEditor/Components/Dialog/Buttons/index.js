import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
export const PositiveButton = ({ onClick, children }) =>
  <button onClick={() => onClick()} className={`${styles.buttons} ${styles.positive}`}>
    {children}
  </button>;

PositiveButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

PositiveButton.defaultProps = {
  onClick: () => {},
};

export const NegativeButton = ({ onClick, children }) =>
  <button onClick={() => onClick()} className={`${styles.buttons} ${styles.negative}`}>
    {children}
  </button>;

NegativeButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

NegativeButton.defaultProps = {
  onClick: () => {},
};
