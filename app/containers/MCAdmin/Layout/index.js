import React from 'react';
import PropTypes from 'prop-types';
import BellIcon from 'react-icons/lib/fa/bell-o';
import MailIcon from 'react-icons/lib/md/mail-outline';
import QuestionMarkIcon from 'react-icons/lib/fa/question';
import Arrow from 'react-icons/lib/fa/caret-up';
import { withRouter } from 'react-router-dom';

import styles from './styles.css';
import auth from '../../../utils/auth';
import { apiUrl, facebookApi, accesses } from '../../../config';
import Dialog from '../../../components/Dialog';
import ConfirmPopup from '../../../components/ConfirmPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import ErrorPopup from '../../../components/ErrorPopup';
import Loading from '../../../components/Loading';
import Button from '../../../components/Button';
import request from '../../../utils/request';
import TopNavigation from '../../../components/TopNavigation';
import objectToParams from '../../../utils/objectToParams';
import CreatePasswordForm from './components/CreatePasswordForm';


class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showUserMenu: false,
      showDeviceUserMenu: false,
      hasPassword: false,
      isFacebookUser: false,
      popup: false,
      user: false,
    };
  }

  componentDidMount() {
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
        this.checkFacebookLogin();
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

    auth.getUser((user) => {
      this.setState({
        user,
        isFacebookUser: user.IsFacebookUser,
        hasPassword: user.HasPassword,
      });
    });
    auth.getWebsite((website) => {
      this.setState({ website });
    });
  }

  checkFacebookLogin() {
    window.FB.api(`/${this.state.user.ClientId}`, { fields: facebookApi.fields }, (me) => {
      if (me.error) {
        window.FB.getLoginStatus((status) => {
          if (status.status !== 'connected') {
            this.setState({ userFacebook: false });
          } else if (status.status === 'connected' && status.authResponse.userID !== this.state.user.ClientId) {
            window.FB.logout(() => {
              this.setState({ userFacebook: false });
            });
          }
        });
      } else {
        this.setState({ userFacebook: me });
      }
    });
  }

  ToggleMenu() {
    if (!this.state.showDeviceUserMenu) {
      this.setState({ showDeviceUserMenu: true });
    } else {
      this.setState({ showDeviceUserMenu: false });
    }
  }

  logout() {
    this.setState({ isLoading: true });
    auth.logout(() => {
      window.location = '/';
    });
  }

  facebookSignUpCancle() {
    this.setState({ isLoading: false });
  }

  integrateFacebookSuccess(authResponse) {
    window.FB.api('/me', { fields: facebookApi.fields }, (me) => {
      Object.assign(me, authResponse);
      auth.integrateFacebook(me.id, me.accessToken, (response) => {
        if (!response.error) {
          auth.updateUser((user) => {
            const popup = (
              <SuccessPopup
                data-automation-id="dialog-facebook-intergration-success"
                onClose={() => this.setState({ popup: false })}
              >
                <h3>Integration Success</h3>
                <div>You’ve successfully authenticated with Facebook</div>
              </SuccessPopup>
            );
            this.setState({
              user,
              isFacebookUser: user.IsFacebookUser,
              hasPassword: user.HasPassword,
              popup,
              isLoading: false,
            });
          });
        } else {
          window.FB.logout(() => {
            const popup = (<ErrorPopup
              data-automation-id="error-facebook-intergration-fail"
              key="errorPopup"
              onClose={() => {
                this.setState({ popup: false });
              }}
              error={response.error}
            />);
            this.setState({
              popup,
              isLoading: false,
            });
          });
        }
      });
    });
  }

  integrateFacebook() {
    this.handleRequestClose();
    this.setState({ isLoading: true });

    const { scope, appId } = facebookApi;

    let isMobile = false;

    try {
      isMobile = ((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
    } catch (ex) {
      // continue regardless of error
    }

    const params = {
      client_id: appId,
      redirect_uri: window.location.href,
      state: 'facebookdirect',
      scope,
    };

    if (isMobile) {
      window.location.href = `https://www.facebook.com/dialog/oauth?${objectToParams(params)}`;
    } else {
      window.FB.login((response) => {
        if (response.authResponse) {
          this.integrateFacebookSuccess(response.authResponse);
        } else {
          this.integrateFacebookCancle();
        }
      }, { scope, auth_type: params.auth_type });
    }
  }

  integrateFacebookCancle() {
    this.setState({ isLoading: false });
  }

  removeIntegrateFacebook() {
    if (this.state.user.HasPassword) {
      this.setState({ isLoading: true, popup: false });
      this.submitRemoveFacebook();
    } else {
      const popup = (<Dialog
        data-automation-id="dialog-createnewpassword"
        title="Create New Password"
        onClose={() => {
          this.setState({ popup: false });
        }}
        // contentStyle={{ width: '500px' }}
      >
        <CreatePasswordForm
          data-automation-id="form-createnewpassword"
          email={this.state.user.Email}
          onSuccess={(password) => this.submitRemoveFacebook(password)}
        />
      </Dialog>);
      this.setState({
        popup,
        isLoading: false,
      });
    }
  }

  submitRemoveFacebook(password = '') {
    request.put(`${apiUrl}/Users/RemoveFacebookAuthentication`, { Password: password }, (response) => {
      if (!response.error) {
        auth.updateUser((user) => {
          const popup = (
            <SuccessPopup
              data-automation-id="dialog-remove-facebook"
              onClose={() => this.setState({ popup: false })}
            >
              <h3>You have been successful</h3>
              <div>You’ve successfully remove Facebook authentication</div>
            </SuccessPopup>
          );
          this.setState({
            popup,
            isLoading: false,
            user,
            isFacebookUser: user.IsFacebookUser,
            hasPassword: user.HasPassword,
          });
        });
      } else {
        const popup = (<ErrorPopup
          data-automation-id="error-remove-facebook-fail"
          key="errorPopup"
          onClose={() => {
            this.setState({ popup: false });
          }}
          error={response.error}
        />);
        this.setState({ popup, isLoading: false });
      }
    });
  }

  removeIntegrateFacebookConfirm() {
    const popup = (
      <ConfirmPopup
        data-automation-id="dialog-remove-facebook-confirm"
        onClose={() => this.setState({ popup: false })}
        actions={[
          <Button data-automation-id="btn-yes" onClick={() => this.removeIntegrateFacebook()}>Yes</Button>,
          <Button btnStyle="negative" data-automation-id="btn-no" onClick={() => this.setState({ popup: false })}>No</Button>,
        ]}
      >
        <h3>Confirmation</h3>
        <div>Are you sure to remove Facebook authentication?</div>
      </ConfirmPopup>
    );
    this.setState({ popup });
  }

  forceFacebookLoginToRemove() {
    window.FB.login((response) => {
      if (response.authResponse && response.authResponse.userID === this.state.user.ClientId) {
        window.FB.api('/me', { fields: facebookApi.fields }, (userFacebook) => {
          this.setState({ userFacebook }, () => {
            this.removeIntegrateFacebookPopup();
          });
        });
      } else if (response.authResponse && response.authResponse.userID !== this.state.user.ClientId) {
        window.FB.logout(() => {
          const popup = (<ErrorPopup
            key="errorPopup"
            onClose={() => {
              this.setState({ userFacebook: false, popup: false });
            }}
            error="This Facebook account is not connected to your account. Please logout of Facebook and try again."
          />);
          this.setState({ popup, isLoading: false });
        });
      } else {
        this.setState({ isLoading: false });
      }
    });
  }

  removeIntegrateFacebookPopup() {
    this.handleRequestClose();
    this.setState({ isLoading: true, dialogOpen: true });
    if (this.state.userFacebook) {
      const popup = (<Dialog
        data-automation-id="dialog-remove-facebook-authentication"
        title="Remove Facebook Authentication"
        onClose={() => {
          this.setState({ popup: false });
        }}
      >
        <div className={styles.removeFacebook}>
          <img alt="presentation" src={this.state.userFacebook.picture.data.url} />
          <p>{this.state.userFacebook.name}</p>
          <Button onClick={() => this.removeIntegrateFacebookConfirm()}>Remove</Button>
        </div>
      </Dialog>);
      this.setState({ popup, isLoading: false });
    } else {
      this.forceFacebookLoginToRemove();
    }
  }

  createCredential() {
    this.handleRequestClose();
    const popup = (<Dialog
      data-automation-id="dialog-create-credential"
      title="Create New Password"
      onClose={() => {
        this.setState({ popup: false });
      }}
      contentStyle={{ width: '500px' }}
    >
      <CreatePasswordForm
        email={this.state.user.Email}
        onSuccess={(password, repassword) => this.submitCreateCredential(password, repassword)}
      />
    </Dialog>);
    this.setState({
      popup,
      isLoading: false,
    });
  }

  submitCreateCredential(password, repassword) {
    request.put(`${apiUrl}/Users/CreatesLoginCredential`,
      {
        Password: password,
        RePassword: repassword,
      },
      (response) => {
        if (!response.error) {
          auth.updateUser((user) => {
            const popup = (
              <SuccessPopup
                data-automation-id="dialog-submit-credential"
                onClose={() => this.setState({ popup: false })}
              >
                <h3>You have been successful</h3>
                <div>New password successfully saved</div>
              </SuccessPopup>
            );
            this.setState({
              popup,
              isLoading: false,
              user,
              isFacebookUser: user.IsFacebookUser,
              hasPassword: user.HasPassword,
            });
          });
        } else {
          const popup = (<ErrorPopup
            key="errorPopup"
            onClose={() => {
              this.setState({ popup: false });
            }}
            error={response.error}
          />);
          this.setState({ popup, isLoading: false });
        }
      });
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      showUserMenu: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      showUserMenu: false,
    });
  };

  render() {
    let menu = [
      {
        name: 'Settings',
        subMenu: [
          { name: 'Plan', link: { to: '/MCAdmin/PlanManagement' } },
          { name: 'Subscription', link: { to: '/MCAdmin/Subscription' } },
        ],
      },
    ];
    if (this.state.website && this.state.website.PaymentStatus === 'Paid') {
      menu = [
        {
          name: 'Dashboard',
          link: { to: '/MCAdmin' },
        },
        {
          name: 'Edit Site',
          accessPermission: accesses.Merchant.WebsiteManager,
          link: { to: '/MCAdmin/WebsiteManagement' },
        },
        {
          name: 'Shop',
          accessPermission: accesses.Merchant.ShopManagement,
          subMenu: [
            { name: 'Payment', link: { to: '/MCAdmin/Payment' }, accessPermission: localStorage.getItem('currentPlan') },
            { name: 'Shipping' },
            { name: 'Discount', link: { to: '/MCAdmin/DiscountDashBoard' } },
            { name: 'Terms & conditions' },
            { name: 'Tax' },
            { name: 'Product' },
            { name: 'Category' },
            { name: 'Brand' },
            { name: 'Order' },
            { name: 'Customer' },
          ],
        },
        {
          name: 'Blog',
          subMenu: [
            { name: 'Blogs', link: { to: '/MCAdmin/Blog/Blog' }, accessPermission: accesses.Merchant.Blog },
            { name: 'Add new blog', link: { to: '/MCAdmin/Blog/Blog/CreateEditBlog' }, accessPermission: accesses.Merchant.Blog },
            { name: 'Category', link: { to: '/MCAdmin/Blog/Category' }, accessPermission: accesses.Merchant.Blog },
            { name: 'Settings', link: { to: '/MCAdmin/Blog/Settings' }, accessPermission: accesses.Merchant.Blog },
          ],
        },
        {
          name: 'Reports',
          subMenu: [
            { name: 'Sales' },
            { name: 'Product Sales' },
            { name: 'Purchase' },
            { name: 'Customer Location' },
            { name: 'Shipping Provider' },
            { name: 'Shipping Location' },
          ],
        },
        {
          name: 'Settings',
          subMenu: [
            { name: 'Business information' },
            { name: 'Plan', link: { to: '/MCAdmin/PlanManagement' }, accessPermission: accesses.Merchant.PlanManagement },
            { name: 'Subscription', link: { to: '/MCAdmin/Subscription' }, accessPermission: accesses.Merchant.SubscriptionManagement },
            { name: 'Staff', link: { to: '/MCAdmin/Staff' }, accessPermission: accesses.Merchant.StaffManagement },
            { name: 'Message' },
            { name: 'Extension' },
          ],
        },
      ];
    }

    const subMenuList = [];
    subMenuList.push(<li key="Update Profile">
      <button data-automation-id="btn-update-profile" onClick={() => this.props.history.push('/MCAdmin/User/UpdateProfile')}>
        Update Profile
      </button>
    </li>);
    subMenuList.push(<hr className={styles.hr} key="Update Profile hr" />);
    if (!this.state.isFacebookUser) {
      subMenuList.push(<li key="Connect to Facebook">
        <button data-automation-id="btn-integrate-facebook" onClick={() => this.integrateFacebook()}>
          Connect to Facebook
        </button>
      </li>);
      subMenuList.push(<hr className={styles.hr} key="Connect Facebook hr" />);
    }
    if (this.state.isFacebookUser && this.state.hasPassword) {
      subMenuList.push(<li key="Remove Facebook">
        <button data-automation-id="btn-remove-facebook" onClick={() => this.removeIntegrateFacebookPopup()}>
          Remove Facebook
        </button>
      </li>);
      subMenuList.push(<hr className={styles.hr} key="Remove Facebook hr" />);
    }
    if (!this.state.hasPassword) {
      subMenuList.push(<li key="Create Login Credentials">
        <button data-automation-id="btn-create-credentials" onClick={() => this.createCredential()}>
          Create Login Credentials
        </button>
      </li>);
      subMenuList.push(<hr className={styles.hr} key="Create Login Credentials hr" />);
    }
    if (this.state.hasPassword) {
      subMenuList.push(<li key="Reset Password">
        <button data-automation-id="btn-account-settings" onClick={() => this.props.history.push('/MCAdmin/User/AccountSettings')}>
          Reset Password
        </button>
      </li>);
      subMenuList.push(<hr className={styles.hr} key="Reset Password hr" />);
    }
    if (this.state.user && (this.state.user.WebsiteRoles.length > 1 || this.state.user.IsCyberaRoleActive)) {
      subMenuList.push(<li key="Switch Account">
        <button data-automation-id="btn-switch-account" onClick={() => this.props.history.push('/Auth/SwitchAccount')}>
          Switch Account
        </button>
      </li>);
      subMenuList.push(<hr className={styles.hr} key="Switch Account hr" />);
    }
    subMenuList.push(<li key="Log out">
      <button data-automation-id="btn-merchant-logout" onClick={() => { this.logout(); }}>
        Log Out
      </button>
    </li>);

    if (!this.state.user || !this.state.website) {
      return <Loading />;
    }

    return (
      <div className={styles.layout} data-automation-id={this.props['data-automation-id']}>
        <TopNavigation
          data-automation-id="merchant-top-navigation"
          Menu={menu}
          onClickMenu={(location, isNewTab) => {
            if (location && !isNewTab) {
              this.setState({ isLoading: true }, () => {
                if (`${window.location.pathname}` === location) {
                  if (window.location.search) {
                    window.location = window.location.href.substr(0, window.location.href.indexOf('?'));
                  } else {
                    window.location.reload();
                  }
                } else {
                  this.props.history.push(location);
                }
              });
            } else if (location) {
              window.open(location, '_blank');
            }
          }}
          userType="Merchant"
          topMenuContent={
            <div className={styles.right}>
              <button data-automation-id="btn-mail" className={styles.topIcon}>
                <MailIcon color="#333" />
              </button>
              <button data-automation-id="btn-help" className={styles.topIcon}>
                <BellIcon color="#333" />
              </button>
              <button data-automation-id="btn-questions" className={styles.topIcon}>
                <QuestionMarkIcon color="#333" />
              </button>
              <div
                data-automation-id="merchant-menu"
                className={styles.rightTopMenuContainer}
                onMouseOver={() => { this.setState({ showUserMenu: true }); }}
                onMouseOut={() => { this.setState({ showUserMenu: false }); }}
                onFocus={() => { this.setState({ showUserMenu: true }); }}
                onBlur={() => { this.setState({ showUserMenu: false }); }}
              >
                <span className={(this.state.showUserMenu) ? styles.memberMenuHover : styles.memberMenu}>
                  <span className={(this.state.showUserMenu) ? styles.thumbHover : styles.thumb}>
                    {`${this.state.user && this.state.user.FirstName[0]}${this.state.user && this.state.user.LastName[0]}`}</span>
                </span>
                <div className={(this.state.showUserMenu) ? styles.arrowContainer : styles.hide}><Arrow size="25" color="#E6E6E6" /></div>
                <div className={(this.state.showUserMenu) ? styles.subMenu : styles.hide}>
                  <ul className={styles.subMenuList}>{subMenuList}</ul>
                </div>
              </div>
              <div //eslint-disable-line
                data-automation-id="btn-togglemenu"
                className={styles.deviceRightTopMenuContainer}
                onClick={() => this.ToggleMenu()}
                role="button"
              >
                <span className={(this.state.showDeviceUserMenu) ? styles.memberMenuHover : styles.memberMenu}>
                  <span className={(this.state.showDeviceUserMenu) ? styles.thumbHover : styles.thumb}>
                    {`${this.state.user && this.state.user.FirstName[0]}${this.state.user && this.state.user.LastName[0]}`}</span>
                </span>
                <div className={(this.state.showDeviceUserMenu) ? styles.arrowContainer : styles.hide}><Arrow size="25" color="#E6E6E6" /></div>
                <div className={(this.state.showDeviceUserMenu) ? styles.subMenu : styles.hide}>
                  <ul className={styles.subMenuList}>{subMenuList}</ul>
                </div>
              </div>
            </div>
          }
        >
          <div className={styles.content}>{this.props.children}</div>
        </TopNavigation>
        {this.state.isLoading && <Loading />}
        {this.state.popup}
      </div>);
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  'data-automation-id': PropTypes.string,
};

Layout.defaultProps = {
  'data-automation-id': '',
};

export default withRouter(Layout);
