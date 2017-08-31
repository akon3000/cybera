import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import SignInIcon from 'react-icons/lib/md/account-circle';
import { Link, withRouter } from 'react-router-dom';
import IconMenu from 'material-ui/svg-icons/navigation/menu';

import s from './styles.css';
import Logo from '../../../../assets/image/logoBlack.png';
import LoginPopup from '../../../Auth/LoginPopup';
import ForceLoginPopup from '../../../Auth/ForceLoginPopup';
import RecoveryPasswordPopup from '../../../Auth/RecoveryPasswordPopup';
import ResetPasswordPopup from '../../../Auth/ResetPasswordPopup';
import auth from '../../../../utils/auth';

export class Header extends Component { // eslint-disable-line
  constructor() {
    super();
    this.state = {
      menuOpen: false,
      showLogin: false,
      showRecoveryPassword: false,
      showResetPassword: location.pathname.toLocaleLowerCase() === '/Auth/ResetPassword'.toLocaleLowerCase(),
      forceLogin: false,
      loggedIn: auth.loggedIn(),
    };

    this.storageUpdate = (event) => {
      if (event.key === 'token' && event.newValue === null) {
        this.setState({ forceLogin: true });
      }
      this.setState({ loggedIn: auth.loggedIn() });
    };
  }

  componentDidMount() {
    window.addEventListener('storage', this.storageUpdate);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showRegisterPopup) { // eslint-disable-line
      this.setState({ loggedIn: auth.loggedIn() });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageUpdate);
  }
  ScrollToContactInfo() {
    const element = document.getElementById('ContactUs');
    element.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const styles = {
      largeIcon: {
        width: 40,
        height: 40,
        color: '#0D597C',
      },
    };

    return (
      <div data-automation-id={this.props['data-automation-id']}>

        <Grid className={s.container} fluid data-automation-id="header-default">
          <Row className={s.navBar}>
            <Col lgOffset={2} lg={6} mdOffset={2} md={6}>
              <ul className={s.nav}>
                <li className={s.navButton}>
                  <button
                    data-automation-id="btn-link-to-singup"
                    style={{ textDecoration: 'none', color: '#FFF' }}
                    onClick={() => this.props.history.push('/signUp')}
                  >TEMPLATES</button>
                </li>
                <li><b> | </b></li>
                <li className={s.navButton}>
                  <button
                    data-automation-id="btn-link-to-packages"
                    style={{ textDecoration: 'none', color: '#FFF' }}
                    onClick={() => this.props.history.push('/Packages')}
                  >PLANS</button>
                </li>
                <li><b> | </b></li>
                <li className={s.navButton}>
                  <button
                    data-automation-id="btn-link-to-singup"
                    style={{ textDecoration: 'none', color: '#FFF' }}
                    onClick={() => this.props.history.push('/signUp')}
                  >CREATE ACCOUNT</button>
                </li>
              </ul>
            </Col>
            <Col lg={3} md={3} sm={6} xs={6}>
              <div className={s.signIn}>
                {!this.state.loggedIn ?
                  (<div>
                    <span>Existing Customer?</span>
                    <SignInIcon size={35} />
                    <button
                      data-automation-id="btn-signin"
                      className={s.navButton}
                      onClick={() => this.setState({ showLogin: true })}
                    >SIGN IN</button>
                  </div>)
                  :
                  (<div style={{ marginTop: '5px' }}>
                    <button
                      data-automation-id="btn-link-to-account"
                      className={s.navButton}
                      onClick={() => {
                        const _ = this;
                        auth.getRole((role) => {
                          if (role.length === 1) {
                            if (role[0] === 'Merchant') {
                              auth.getUser((user) => {
                                if (user.WebsiteRoles && user.WebsiteRoles.length === 1) {
                                  auth.setWebsiteID(user.WebsiteRoles[0].WebsiteId, () => {
                                    auth.getWebsite(() => {
                                      _.props.history.push('/MCAdmin');
                                    });
                                  });
                                } else {
                                  _.props.history.push('/Auth/SwitchAccount');
                                }
                              });
                            } else if (role[0] === 'Cybera') {
                              auth.getUser(() => {
                                _.props.history.push('/CBAdmin');
                              });
                            }
                          } else if (role.length === 2) {
                            auth.getUser(() => {
                              this.props.history.push('/Auth/SwitchAccount');
                            });
                          }
                        });
                      }}
                    >GO TO ACCOUNT</button>
                    <span className={s.pipe}>|</span>
                    <button
                      data-automation-id="btn-logout"
                      className={s.navButton}
                      onClick={() => {
                        auth.logout(() => {
                          this.setState({ showLogin: false, loggedIn: auth.loggedIn() });
                        });
                      }}
                    >LOG OUT</button>
                  </div>)
                }
              </div>
            </Col>
          </Row>
          <Row className={s.logoBar}>
            <Col lgOffset={1} lg={4} mdOffset={1} md={4}>
              <div className={s.logoImageContainer} >
                <Link data-automation-id="link-to-homepage" to={'/'} style={{ textDecoration: 'none', color: '#FFF' }}><img src={Logo} alt="Cybera Logo" /></Link>
              </div>
            </Col>
            <Col lgOffset={2} lg={4} mdOffset={2} md={4} sm={6} xs={6}>
              <div className={s.contactNumber}>
                <b>1800 292 372</b>
              </div>
            </Col>
          </Row>
        </Grid>

        <Grid className={s.Mobilecontainer} fluid data-automation-id="header-mobile">
          <Row className={s.logoBarMobile} >
            <Col md={6} sm={6} xs={6}>
              <div className={s.logoImageContainerMobile} id="Topbar">
                <Link data-automation-id="link-to-homepage" to={'/'} style={{ textDecoration: 'none', color: '#FFF' }}><img src={Logo} alt="Cybera Logo" /></Link>
              </div>
            </Col>
            <Col md={6} sm={6} xs={6} className={s.toggleMenuContainer}>
              <button
                data-automation-id="btn-toggle-menu"
                className={s.toggleMenu}
                onClick={() => { this.setState({ menuOpen: !this.state.menuOpen }); }}
              >
                <IconMenu style={styles.largeIcon} />
              </button>
            </Col>
            <Col md={12} sm={12} xs={12} className={this.state.menuOpen ? s.menuOpen : ''}>
              <div className={s.navMobileContainer}>
                <ul className={s.navMobile}>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}><li className={s.navButton}><b> TEMPLATES </b></li></Link>
                  <Link data-automation-id="link-to-packages" to={'/Packages'} style={{ textDecoration: 'none', color: '#FFF' }}><li className={s.navButton}><b> PLANS </b></li></Link>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}><li className={s.navButton}><b> CREATE ACCOUNT </b></li></Link>
                  {!auth.loggedIn() ?
                    (<button data-automation-id="btn-signin" onClick={() => this.setState({ showLogin: true })}>
                      <li className={s.navButton}> SIGN IN </li>
                    </button>)
                    :
                    (<div>
                      <button
                        data-automation-id="btn-logout"
                        onClick={() =>
                          auth.logout(() => {
                            this.setState({ showLogin: false });
                          })
                        }
                      >
                        <li className={s.navButton}> LOG OUT </li>
                      </button>
                      <button
                        data-automation-id="btn-link-to-account"
                        onClick={() => {
                          auth.getRole((role) => {
                            if (role.length === 1) {
                              if (role[0] === 'Merchant') {
                                auth.getUser((user) => {
                                  if (user.WebsiteRoles && user.WebsiteRoles.length === 1) {
                                    auth.setWebsiteID(user.WebsiteRoles[0].WebsiteId);
                                    auth.getWebsite(() => {
                                      this.props.history.push('/MCAdmin');
                                    });
                                  } else {
                                    this.props.history.push('/Auth/SwitchAccount');
                                  }
                                });
                              } else if (role[0] === 'Cybera') {
                                this.props.history.push('/CBAdmin');
                              }
                            } else if (role.length === 2) {
                              auth.getUser((user) => {
                                if (user.WebsiteRoles.length === 0) {
                                  this.props.history.push('/CBAdmin');
                                } else if (user.WebsiteRoles.length > 0) {
                                  this.props.history.push('/Auth/SwitchAccount');
                                }
                              });
                            }
                          });
                        }}
                      >
                        <li className={s.navButton}> GO TO ACCOUNT </li>
                      </button>
                    </div>)
                  }
                  <button data-automation-id="btn-link-to-contact" onClick={() => this.ScrollToContactInfo()}><li className={s.navButton}> CONTACT US </li></button>
                </ul>
              </div>
            </Col>
          </Row>
        </Grid>

        { this.state.showLogin &&
          <LoginPopup
            onClose={() => this.setState({ showLogin: false })}
            openRecoveryPasswordPopup={() => this.setState({ showLogin: false, showRecoveryPassword: true })}
            redirectTo={this.state.redirectTo}
          />
        }

        { this.state.forceLogin &&
          <ForceLoginPopup
            onLoginSuccess={() => {
              const _ = this;
              _.setState({ forceLogin: false }, () => {
                auth.setWebsiteID(localStorage.getItem('tempWebsiteID'), () => {
                  _.setState({ loggedIn: auth.loggedIn() });
                });
              });
            }}
          />
        }

        { this.state.showRecoveryPassword &&
          <RecoveryPasswordPopup
            onClose={() => this.setState({ showRecoveryPassword: false })}
          />
        }

        { this.state.showResetPassword &&
          <ResetPasswordPopup
            onClose={() => this.setState({ showResetPassword: false })}
            onClickSignIn={() => this.setState({ showResetPassword: false, showLogin: true })}
          />
        }

      </div>
    );
  }
}

Header.propTypes = {
  history: PropTypes.object.isRequired,
  'data-automation-id': PropTypes.string,
};

Header.defaultProps = {
  'data-automation-id': '',
};

export default withRouter(Header);
