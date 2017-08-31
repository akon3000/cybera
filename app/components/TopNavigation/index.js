import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router';
import Arrow from 'react-icons/lib/fa/caret-up';
import PencilIcon from 'react-icons/lib/ti/pencil';
import IconMenu from 'material-ui/svg-icons/navigation/menu';
import IconUpgrade from 'react-icons/lib/md/file-upload';
import IconPayment from 'react-icons/lib/fa/credit-card-alt';
import auth from '../../utils/auth';
import styles from './styles.css';
import Logo from '../../assets/image/180x65_gray2.png';
import AdminstrationIcon from './Icon/administration.png';
import MarketingIcon from './Icon/marketing.png';
import ReportIcon from './Icon/report.png';
import SettingsIcon from './Icon/settings.png';
import UserIcon from './Icon/user.png';
import ProductIcon from './Icon/products.png';
import PageIcon from './Icon/page.png';
import BlogIcon from './Icon/blog.png';
import ShopIcon from './Icon/online-shop.png';
import Button from '../Button';

import request from '../../utils/request';
import { apiUrl, accesses } from '../../config';

import { version } from '../../../package.json';


class TopNavigation extends Component {

  constructor(props) {
    super(props);
    const menu = [];
    auth.getAccesses(this.props.userType, (accs) => {
      this.props.Menu.forEach((m) => {
        if ((m.accessPermission && accs.indexOf(m.accessPermission) !== -1) || !m.accessPermission) {
          if (m.subMenu) {
            const subMenu = [];
            m.subMenu.forEach((sm) => {
              if (sm.accessPermission && (sm.name === 'Payment' && sm.accessPermission !== 'Web Only (no e-commerce)')) {
                subMenu.push(sm);
              } else if ((sm.accessPermission && accs.indexOf(sm.accessPermission) !== -1) || !sm.accessPermission) {
                subMenu.push(sm);
              }
            });
            if (subMenu.length) {
              const tempMenu = m;
              tempMenu.subMenu = subMenu;
              menu.push(tempMenu);
            }
          } else {
            menu.push(m);
          }
        }
      });
    });
    this.state = {
      menu,
      showMenuName: '',
      showDeviceMenu: false,
      showDeviceSubMenuName: '',
      bodyStyle: {
        minHeight: (props.userType === 'Merchant') ? `${window.innerHeight - 159}px` : `${window.innerHeight - 110}px`,
      },
      showPaymentButton: false,
      showUpgradePlan: false,
      backendVersion: '',
    };
  }

  componentWillMount() {
    const websiteDetails = localStorage.getItem('website') ? JSON.parse(localStorage.getItem('website')) : null;
    localStorage.setItem('currentPlan', (websiteDetails && websiteDetails.WebsitePlan[0].Plan.Name));
    if (this.props.userType === 'Merchant') {
      auth.getAccesses('Merchant', (accs) => {
        this.setState({
          haveSubscriptionManagementAccess: accs.indexOf(accesses.Merchant.SubscriptionManagement) !== -1,
          havePlanManagementAccess: accs.indexOf(accesses.Merchant.PlanManagement) !== -1,
        }, () => this.checkButtons());
      });
    }
  }

  componentDidMount() {
    request.get(`${apiUrl}/system/version`, {}, (response) => {
      if (response.data) {
        this.setState({ backendVersion: response.data.Ver });
      }
    });
  }

  checkButtons() {
    if (localStorage.getItem('TopNavigationData')) {
      const topNavigationData = JSON.parse(localStorage.getItem('TopNavigationData'));
      const { websiteID, expireDate, showPaymentButton, showUpgradePlanButton } = topNavigationData;
      const now = new Date();
      if (now < new Date(expireDate) && websiteID === localStorage.getItem('websiteID')) {
        this.setState({ showPaymentButton, showUpgradePlanButton });
      } else {
        this.updateButtons();
      }
    } else {
      this.updateButtons();
    }
  }

  updateButtons() {
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/WebsitePlan/false`, {}, (response) => {
      if (!response.error) {
        if (response.data) {
          auth.getWebsite((website) => {
            const nextPayment = new Date(response.data.EndDate);
            const tenDaysBeforeExpire = nextPayment.setDate(nextPayment.getDate() - 10);
            const aboutToExpire = tenDaysBeforeExpire <= new Date();
            const isShowPaymentButton = (aboutToExpire && !response.data.IsAutoRenewal) || website.PaymentStatus === 'Overdue';

            request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/WebsitePlan/true`, {}, (response2) => {
              let isShowPendingPaymentButton = false;
              let showUpgradePlanButton = true;
              if (!response2.error) {
                if (response2.data) {
                  showUpgradePlanButton = false;
                  const nextPayment2 = response2.data.IsPaid === false ? new Date(response2.data.StartDate) : new Date(response2.data.EndDate);
                  const tenDaysBeforeExpire2 = nextPayment2.setDate(nextPayment2.getDate() - 10);
                  const aboutToExpire2 = tenDaysBeforeExpire2 <= new Date();
                  isShowPendingPaymentButton = aboutToExpire2 && !response2.data.isAutoRenewal;
                }
              }

              const topNavigationData = {
                showPaymentButton: isShowPaymentButton || isShowPendingPaymentButton,
                showUpgradePlanButton,
                websiteID: localStorage.getItem('websiteID'),
                expire: new Date().setDate(new Date().getDate() + 1),
              };
              localStorage.setItem('TopNavigationData', JSON.stringify(topNavigationData));
              this.setState({
                showPaymentButton: this.state.haveSubscriptionManagementAccess && topNavigationData.showPaymentButton,
                showUpgradePlanButton: this.state.havePlanManagementAccess && topNavigationData.showUpgradePlanButton,
              });
            });
          });
        }
      }
    });
  }

  push(link) {
    const location = link ? link.to : '';
    const isNewTab = link && link.isNewTab ? link.isNewTab : false;
    if (location) {
      this.props.onClickMenu(location, isNewTab);
    }
  }

  ToggleMenu() {
    if (!this.state.showDeviceMenu) {
      this.setState({ showDeviceMenu: true,
        showDeviceSubMenuName: '',
      });
    } else {
      this.setState({ showDeviceMenu: false });
    }
  }

  ToggleSubMenu(menuName) {
    if (this.state.showDeviceSubMenuName === menuName) {
      this.setState({ showDeviceSubMenuName: '' });
    } else {
      this.setState({ showDeviceSubMenuName: menuName });
    }
  }

  render() {
    const Images = [
      { name: 'Administration', image: AdminstrationIcon },
      { name: 'Marketing', image: MarketingIcon },
      { name: 'Cybera User', image: UserIcon },
      { name: 'Reports', image: ReportIcon },
      { name: 'Settings', image: SettingsIcon },
      { name: 'Product', image: ProductIcon },
      { name: 'Page & Menu', image: PageIcon },
      { name: 'Blog', image: BlogIcon },
      { name: 'Shop', image: ShopIcon },
    ];
    const iconStyles = {
      width: 35,
      height: 35,
      color: '#117DB8',
    };
    const menuList = [];
    let menuCount = 0;
    this.state.menu.forEach((value) => {
      let dropdownMenuIcon;
      Images.forEach((imageValue) => {
        if (imageValue.name === value.name) {
          dropdownMenuIcon = imageValue.image;
        }
      });
      let subMenuCount = 0;
      const subMenuList = [];
      if (value.subMenu) {
        value.subMenu.forEach((subMenuValue) => {
          subMenuList.push(<li key={subMenuValue.name + subMenuCount}>
            <button onClick={() => this.push(subMenuValue.link)}>
              {subMenuValue.name}
            </button>
          </li>);
          if (subMenuCount !== (value.subMenu.length - 1)) {
            subMenuList.push(<hr className={styles.hr} key={`${subMenuValue.name + subMenuCount}hr`} />);
          }
          subMenuCount += 1;
        });
        menuList.push(<li // eslint-disable-line
          key={value.name + (menuCount += 1)}
          className={styles.menuList}
          onMouseOver={() => { this.setState({ showMenuName: value.name }); }}
          onMouseOut={() => { this.setState({ showMenuName: '' }); }}
        >
          <button>{value.name}</button>
          <div className={((this.state.showMenuName === value.name) ? styles.arrowContainer : styles.hide)}><Arrow size="25" color="#BFD9E3" /></div>
          <div className={((this.state.showMenuName === value.name) ? styles.subMenu : styles.hide)}>
            <div className={styles.imgContainer}>
              <img src={dropdownMenuIcon} alt="Shop" />
            </div>
            <ul className={styles.subMenuList}>{subMenuList}</ul>
          </div>
        </li>);
      } else {
        menuList.push(<li // eslint-disable-line
          key={value.name + (menuCount += 1)}
          className={styles.menuList}
        >
          <button onClick={() => this.push(value.link)}>{value.name}</button>
        </li>);
      }
    });

    const TabletMenu = [];
    const menuLength = this.state.menu.length;
    let menuCountTablet = 0;
    const tabletRuntime = (menuLength % 3 === 0) ? Math.floor(menuLength / 3) : Math.floor(menuLength / 3) + 1;
    for (let i = 0; i < tabletRuntime; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        let dropdownMenuIcon;
        const TabletSubMenu = [];
        let subMenuCountTablet = 0;
        const TabletmenuName = this.state.menu[menuCountTablet].name;
        Images.forEach((imageValue) => {
          if (imageValue.name === TabletmenuName) {
            dropdownMenuIcon = imageValue.image;
          }
        });
        if (this.state.menu[menuCountTablet].subMenu) {
          const subMenuLength = this.state.menu[menuCountTablet].subMenu.length;
          this.state.menu[menuCountTablet].subMenu.forEach((value) => {
            TabletSubMenu.push(<li key={`TabletSubMenu${value.name}`}>
              <button onClick={() => this.push(value.link)}>
                {value.name}
              </button>
            </li>);
            if (subMenuCountTablet !== (subMenuLength - 1)) {
              TabletSubMenu.push(<hr className={styles.hr} key={`${value.name}hr`} />);
            }
            subMenuCountTablet += 1;
          });
          TabletMenu.push(<Col md={4} sm={4} key={`TabletMenu${menuCountTablet}`} style={{ margin: '10px 0' }}>
            <button
              className={(this.state.showDeviceSubMenuName === TabletmenuName && styles.activeMenu)}
              onClick={() => this.ToggleSubMenu(TabletmenuName)}
            >
              {TabletmenuName}
            </button>
            <div className={(this.state.showDeviceSubMenuName === TabletmenuName) ? styles.TabletSubMenu : styles.hide}>
              <div className={styles.TabletimgContainer}>
                <img src={dropdownMenuIcon} alt="Shop" />
              </div>
              <ul>{TabletSubMenu}</ul>
            </div>
          </Col>);
        } else {
          const link = this.state.menu[menuCountTablet].link;
          TabletMenu.push(<Col md={4} sm={4} key={`TabletMenu${menuCountTablet}`} style={{ margin: '10px 0' }}>
            <button onClick={() => this.push(link)}>
              {TabletmenuName}
            </button>
          </Col>);
        }
        menuCountTablet += 1;
        if (menuCountTablet === menuLength) {
          break;
        }
      }
    }

    const MobileMenu = [];
    let menuCountMobile = 0;
    const mobileRuntime = (menuLength % 2 === 0) ? Math.floor(menuLength / 2) : Math.floor(menuLength / 2) + 1;
    for (let i = 0; i < mobileRuntime; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        const MobileSubMenu = [];
        let subMenuCountMobile = 0;
        const MobilemenuName = this.state.menu[menuCountMobile].name;
        if (this.state.menu[menuCountMobile].subMenu) {
          const subMenuLength = this.state.menu[menuCountMobile].subMenu.length;
          this.state.menu[menuCountMobile].subMenu.forEach((value) => {
            MobileSubMenu.push(<li key={`MobileSubMenu${value.name}`}>
              <button onClick={() => this.push(value.link)}>
                {value.name}
              </button>
            </li>);
            if (subMenuCountMobile !== (subMenuLength - 1)) {
              MobileSubMenu.push(<hr className={styles.hr} key={`${value.name}hr`} />);
            }
            subMenuCountMobile += 1;
          });
          MobileMenu.push(<Col
            xs={6} key={`MobileMenu${menuCountMobile}`}
            className={(this.state.showDeviceSubMenuName !== MobilemenuName && styles.closeSubMenuContainer)}
            style={{ margin: '5px 0' }}
          >
            <button
              onClick={() => this.ToggleSubMenu(MobilemenuName)}
              className={(this.state.showDeviceSubMenuName === MobilemenuName && styles.activeMenu)}
            >
              {MobilemenuName}
            </button>
            <div className={(this.state.showDeviceSubMenuName === MobilemenuName) ? styles.MobileSubMenu : styles.closeSubMenu}>
              <ul>{MobileSubMenu}</ul>
            </div>
          </Col>);
        } else {
          const link = this.state.menu[menuCountMobile].link;
          MobileMenu.push(<Col xs={6} key={`MobileMenu${menuCountMobile}`} style={{ margin: '5px 0' }}>
            <button onClick={() => this.push(link)}>
              {MobilemenuName}
            </button>
          </Col>);
        }
        menuCountMobile += 1;
        if (menuCountMobile === menuLength) {
          break;
        }
      }
    }

    return (
      <Grid fluid className={styles.Container}>
        <Row className={styles.Header}>
          <Col md={3} lg={3} sm={4} xs={4} style={{ padding: 0 }}>
            <div className={styles.logoContainer}>
              <img src={Logo} alt="Cybera Logo" />
            </div>
          </Col>
          <Col md={6} lg={6} className={styles.MobileHide}>
            <ul className={styles.mainMenu}>{menuList}</ul>
          </Col>
          <Col md={3} lg={3} sm={8} xs={8} style={{ padding: 0, textAlign: 'right' }}>
            <div className={styles.topRightMenu}>
              {this.props.topMenuContent}
            </div>
            <button
              className={styles.toggleMenu}
              onClick={() => this.ToggleMenu()}
            >
              <IconMenu style={iconStyles} />
            </button>
          </Col>
        </Row>
        <div className={(this.state.showDeviceMenu) ? styles.TabletMenuBigContainer : styles.hide}>
          <Row className={styles.TabletMenuContainer}>
            {TabletMenu}
          </Row>
        </div>
        <div className={(this.state.showDeviceMenu) ? styles.MobileMenuBigContainer : styles.hide}>
          <Row className={styles.MobileMenuContainer}>
            {MobileMenu}
          </Row>
        </div>
        {this.props.userType === 'Merchant' &&
          <Row className={styles.lowerHeader}>
            <Col md={12} lg={12} sm={12} xs={12}>
              <div>
                <Button btnStyle="highlighted"><PencilIcon />Edit Site</Button>
                {this.state.showUpgradePlanButton && <Button btnStyle="highlighted" onClick={() => this.props.history.push('/MCAdmin/PlanManagement')}><IconUpgrade />Upgrade Plan</Button>}
                {this.state.showPaymentButton && <Button btnStyle="highlighted" onClick={() => { this.props.history.push('/MCAdmin/Subscription?showPayment=true'); }}><IconPayment />Make A Payment</Button>}
              </div>
            </Col>
          </Row>
        }
        <div className={styles.BodyContainer} style={this.state.bodyStyle}>
          {this.props.children}
        </div>
        <Row className={styles.footer}>
          <Col md={12} lg={12} sm={12} xs={12}>
              Copyright Cybera ©{new Date().getFullYear()} <small>v{version}{this.state.backendVersion && ` - v${this.state.backendVersion}`}</small>
          </Col>
        </Row>
      </Grid>
    );
  }
}

TopNavigation.propTypes = {
  children: PropTypes.node.isRequired,
  Menu: PropTypes.array.isRequired,
  topMenuContent: PropTypes.node.isRequired,
  userType: PropTypes.string.isRequired,
  onClickMenu: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(TopNavigation);
