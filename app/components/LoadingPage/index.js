import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../../assets/image/logo-without-text.png';
import styles from './styles.css';

const LoadingPage = (props) => (<div className={styles.container}>
  <img className={styles.logo} src={Logo} alt="presentation" />
  {props.children}
</div>);

LoadingPage.propTypes = {
  children: PropTypes.node,
};

LoadingPage.defaultProps = {
  children: null,
};

export default LoadingPage;
