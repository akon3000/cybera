import React from 'react';
import PropTypes from 'prop-types';
import MerchantIcon from 'react-icons/lib/md/people-outline';
import MarketingIcon from 'react-icons/lib/fa/bullhorn';
import PersonIcon from 'react-icons/lib/ti/spanner-outline';
import ReportIcon from 'react-icons/lib/go/graph';
import Arrow from 'react-icons/lib/fa/caret-up';
import { withRouter } from 'react-router-dom';
import styles from './styles.css';
import auth from '../../../utils/auth';
import Loading from '../../../components/Loading';
import TopNavigation from '../../../components/TopNavigation';

import { accesses } from '../../../config';

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      user: false,
      showUserMenu: false,
      showDeviceUserMenu: false,
    };
  }

  componentDidMount() {
    auth.getUser((user) => {
      this.setState({ user });
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

  render() {
    const menu = [
      {
        name: 'Dashboard',
        link: { to: '/CBAdmin' },
      },
      {
        name: 'Administration',
        icon: <MerchantIcon />,
        subMenu: [
          { name: 'Merchants', link: { to: '/CBAdmin/MerchantDashBoard' }, accessPermission: accesses.Cybera.Merchant },
          { name: 'Websites', link: { to: '/CBAdmin/WebsiteDashBoard' }, accessPermission: accesses.Cybera.Merchant },
        ],
      },
      {
        name: 'Marketing',
        icon: <MarketingIcon />,
        subMenu: [
        //  { name: 'Campaigns' },
          { name: 'Discounts', link: { to: '/CBAdmin/DiscountDashBoard' }, accessPermission: accesses.Cybera.Discount },
        ],
      },
      {
        name: 'Cybera User',
        icon: <PersonIcon />,
        subMenu: [
          { name: 'Users', link: { to: '/CBAdmin/CyberaUser' }, accessPermission: accesses.Cybera.Staff },
          { name: 'Roles', link: { to: '/CBAdmin/CyberaRole' }, accessPermission: accesses.Cybera.Staff },
        ],
      },
      {
        name: 'File manager',
        link: { to: '/CBAdmin/FileManager' },
        accessPermission: accesses.Cybera.FileManager,
      },
      {
        name: 'Reports',
        icon: <ReportIcon />,
        subMenu: [
          { name: 'New Registration',
            link: { to: '/CBAdmin/MerchantReport/Registration' },
            accessPermission: accesses.Cybera.Report,
          },
          { name: 'Renewal',
            link: { to: '/CBAdmin/MerchantReport/PlanRenewal' },
            accessPermission: accesses.Cybera.Report,
          },
          { name: 'Plan Modification',
            link: { to: '/CBAdmin/MerchantReport/PlanModification' },
            accessPermission: accesses.Cybera.Report,
          },
          { name: 'Total Spending',
            link: { to: '/CBAdmin/MerchantReport/TotalSpending' },
            accessPermission: accesses.Cybera.Report,
          },
          { name: 'Outstanding Payments',
            link: { to: '/CBAdmin/MerchantReport/OutstandingPayment' },
            accessPermission: accesses.Cybera.Report,
          },
          { name: 'Cancellation',
            link: { to: '/CBAdmin/MerchantReport/PlanSubscriptionCancellation' },
            accessPermission: accesses.Cybera.Report,
          },
          { name: 'File Manager Storage Usage',
            link: { to: '/CBAdmin/MerchantReport/FileManagerUsage' },
            accessPermission: 'Report',
          },
          { name: 'Newsletter Subscription',
            link: { to: '/CBAdmin/MerchantReport/NewsletterSubscriber' },
            accessPermission: accesses.Cybera.Report,
          },
        ],
      },
    ];

    const subMenuList = [];
    if (this.state.user && this.state.user.WebsiteRoles.length > 0) {
      subMenuList.push(<li key="Switch Account">
        <button data-automation-id="btn-cybera-switchaccount" onClick={() => { this.props.history.push('/Auth/SwitchAccount'); }}>
          Switch Account
        </button>
      </li>);
      subMenuList.push(<hr className={styles.hr} key="hr" />);
    }
    subMenuList.push(<li key="Log out">
      <button data-automation-id="btn-cybera-logout" onClick={() => { this.logout(); }}>
        Log Out
      </button>
    </li>);

    return (
      <div className={styles.layout}>
        <TopNavigation
          data-automation-id="cybera-top-navigation"
          Menu={menu}
          onClickMenu={(location) => {
            if (location) {
              if (window.location.pathname === location) {
                window.location.reload();
              } else {
                this.setState({ isLoading: true }, () => {
                  this.props.history.push(location);
                });
              }
            }
          }}
          userType="Cybera"
          topMenuContent={
            <div className={styles.right}>
              <div
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
                data-automation-id="btn-togglemenu-cybera"
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
      </div>);
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Layout);
