import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import logoImg from '../../../../assets/image/logo.png';
import styles from './styles.css';
import MenuToggle from './MenuToggle';

export function Topbar(props) {
  const styleElement = {
    background: 'transparent',
    boxShadow: 0,
  };

  return (
    <AppBar
      style={styleElement}
      title={<img src={logoImg} alt="presentation" className={styles.logo} />}
      className={styles.bar}
      showMenuIconButton={false}

      iconElementRight={<MenuToggle redirectTo={props.redirectTo} />}
    />
  );
}

Topbar.propTypes = {
  redirectTo: PropTypes.string,
};

Topbar.defaultProps = {
  redirectTo: null,
};

export default Topbar;
