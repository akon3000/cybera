import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/svg-icons/navigation/menu';

import styles from './styles.css';
import LoginPopup from '../../../../Auth/LoginPopup';
import RecoveryPasswordPopup from '../../../../Auth/RecoveryPasswordPopup';
import ResetPasswordPopup from '../../../../Auth/ResetPasswordPopup';
import auth from '../../../../../utils/auth';
import { facebookApi } from '../../../../../config';

class MenuToggle extends React.Component {

  constructor() {
    super();
    this.state = {
      isOpen: false,
      isOpenLogin: false,
      isOpenRecoveryPassword: false,
      isOpenResetPassword: location.pathname === '/auth/resetPassword',
      isLoggedIn: auth.loggedIn(),
    };
  }

  componentDidMount() {
    if (localStorage.getItem('authType') === 'Facebook') {
      const { appId, xfbml, cookie, version, autoLoad, language } = facebookApi;

      let fbRoot = document.getElementById('fb-root');

      if (!fbRoot) {
        fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';

        document.body.appendChild(fbRoot);
      }

      window.fbAsyncInit = () => {
        window.FB.init({
          version: `v${version}`,
          appId,
          xfbml,
          cookie,
          status: true,
        });

        if (autoLoad || window.location.search.includes('facebookdirect')) {
          // window.FB.getLoginStatus(this.checkLoginAfterRefresh);
        }
      };
      // Load the SDK asynchronously
      ((d, s, id) => {
        const element = d.getElementsByTagName(s)[0];
        const fjs = element;
        let js = element;
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = `//connect.facebook.net/${language}/all.js`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  }

  onToggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  openLoginPopup() {
    this.setState({ isOpenLogin: true });
  }

  closeLoginPopup() {
    this.setState({
      isOpenLogin: false,
      isLoggedIn: auth.loggedIn(),
    });
  }

  openRecoveryPasswordPopup() {
    this.closeLoginPopup();
    this.setState({ isOpenRecoveryPassword: true });
  }

  closeRecoveryPasswordPopup() {
    this.setState({ isOpenRecoveryPassword: false });
  }

  openResetPasswordPopup() {
    this.closeLoginPopup();
    this.setState({ isOpenResetPassword: true });
  }

  closeResetPasswordPopup() {
    this.setState({ isOpenResetPassword: false });
  }

  logoutCallback() {
    this.setState({ isLoggedIn: false });
  }

  logout(_this) {
    const callback = () => { _this.setState({ isLoggedIn: false }); };
    if (localStorage.getItem('authType') === 'Facebook') {
      window.FB.logout(() => {
        auth.logout(() => { callback(); });
      });
    } else {
      auth.logout(() => { callback(); });
    }
  }

  render() {
    const menuItems = [
      <FlatButton key="about" label="ABOUT" id="about" labelStyle={{ color: '#fff' }} />,
      <FlatButton key="plan" label="PLAN" id="plan" labelStyle={{ color: '#fff' }} />,
      <FlatButton key="signup" label="SIGN UP" id="signup" labelStyle={{ color: '#fff' }} />,
    ];

    if (!this.state.isLoggedIn) {
      menuItems.push(<FlatButton key="login" label="LOG IN" id="login" labelStyle={{ color: '#fff' }} onClick={() => this.openLoginPopup()} />);
    } else {
      menuItems.push(<FlatButton
        key="logout" label="LOG OUT" id="logout" labelStyle={{ color: '#fff' }}
        onClick={() => { this.logout(this); }}
      />
      );
    }

    return (<div className={this.state.isOpen ? styles.isOpen : ''}>
      <div className={styles.toggleIcon}>
        <IconButton onClick={() => { this.setState({ isOpen: !this.state.isOpen }); }} iconStyle={{ color: '#fff' }}>
          <IconMenu>
            {menuItems}
          </IconMenu>
        </IconButton>
      </div>
      <div className={styles.menuList}>
        {menuItems}
      </div>
      {(this.state.isOpenLogin) &&
        <LoginPopup
          onClose={() => this.closeLoginPopup()}
          openRecoveryPasswordPopup={() => this.openRecoveryPasswordPopup()}
          redirectTo={this.props.redirectTo}
        />}
      { this.state.isOpenRecoveryPassword &&
        <RecoveryPasswordPopup
          onClose={() => this.closeRecoveryPasswordPopup()}
        />}
      { this.state.isOpenResetPassword &&
        <ResetPasswordPopup
          onClose={() => this.closeResetPasswordPopup()}
          onClickSignIn={() => { this.closeResetPasswordPopup(); this.openLoginPopup(); }}
        />}
    </div>);
  }
}

MenuToggle.propTypes = {
  redirectTo: PropTypes.string,
};

MenuToggle.defaultProps = {
  redirectTo: null,
};

export default MenuToggle;
