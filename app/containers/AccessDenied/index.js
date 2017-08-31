import React from 'react';
import Button from '../../components/Button';
import LoadingPage from '../../components/LoadingPage';
import styles from './styles.css';
import auth from '../../utils/auth';
import LoginPupup from '../Auth/LoginPopup';
import ResetPasswordPopup from '../Auth/ResetPasswordPopup';
import logo from '../../assets/image/logoBlack.png';

export default class AccessDenied extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      showLogin: false,
      // loading: true,
    };
  }

  componentWillMount() {
    // auth.logout(() => {
    //   this.setState({ loading: false });
    // });
  }

  render() {
    if (this.state.loading) {
      return <LoadingPage />;
    }

    return (
      <div className={styles.container}>
        <img src={logo} alt="logo" />
        <h1>
            Access Denied
        </h1>
        <div>
          {!auth.loggedIn() && <Button onClick={() => this.setState({ showLogin: true })}>Login</Button>}
        </div>
        {this.state.showLogin &&
        <LoginPupup
          onClose={() => this.setState({ showLogin: false, showRecoveryPasswordPopup: false })}
          openRecoveryPasswordPopup={() => this.setState({ showLogin: false, showRecoveryPasswordPopup: true })}
        />
    }
        {this.state.showRecoveryPasswordPopup &&
        <ResetPasswordPopup onClose={() => this.setState({ showLogin: false, showRecoveryPasswordPopup: false })} />
        }
      </div>
    );
  }
}
