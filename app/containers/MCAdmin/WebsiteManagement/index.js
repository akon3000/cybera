import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import SettingIcon from 'react-icons/lib/md/settings';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Button from '../../../components/Button';
import WritingIcon from './writing.png';
import DesktopIcon from './desktop.png';
import TabletIcon from './tablet.png';
import MobileIcon from './mobile.png';
import ArrowIconBlue from './arrowsBlue.svg';
import ArrowIconWhite from './arrowsWhite.svg';
import FormIcon from './business.png';
// import WebsiteInfoIcon from './information.png';
import RocketIcon from './domain.png';
import styles from './styles.css';

export class WebsiteManagement extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-website-management-link" key="Website Management" onClick={() => window.location.reload()}>Website Management</button>,
    ];
    return (
      <Layout data-automation-id="page-website-management-home">
        <BreadCrumb breadCrumb={breadCrumb} />
        <h2>Website Management</h2>
        <div className={styles.container}>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <div className={styles.websiteEditContainer}>
                <div className={styles.decorateWebsiteImgContainer}>
                  <img src={WritingIcon} alt="Writing" />
                  <div>Build your Website</div>
                  <Button data-automation-id="btn-edit-website">Edit</Button>
                </div>
                <div className={styles.previewContainer}>
                  <ul className={styles.previewList}>
                    <li>
                      <img src={DesktopIcon} alt="Desktop" />
                      <p>Preview Desktop</p>
                      <button data-automation-id="btn-link-desktop-preview"><img className={styles.linkbutton} src={ArrowIconBlue} alt="Arrow" /></button>
                      <div className={styles.clearFloat}></div>
                    </li>
                    <li>
                      <img src={TabletIcon} alt="Tablet" />
                      <p>Preview Tablet</p>
                      <button data-automation-id="btn-link-tablet-preview"><img className={styles.linkbutton} src={ArrowIconBlue} alt="Arrow" /></button>
                      <div className={styles.clearFloat}></div>
                    </li>
                    <li>
                      <img src={MobileIcon} alt="Mobile" />
                      <p>Preview Mobile</p>
                      <button data-automation-id="btn-link-mobile-preview"><img className={styles.linkbutton} src={ArrowIconBlue} alt="Arrow" /></button>
                      <div className={styles.clearFloat}></div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={styles.businessFormContainer}>
                <img src={FormIcon} alt="Form" />
                <div className={styles.businessFormButtonContainer}>
                  <div><b>Add a Form</b></div>
                  <Button data-automation-id="btn-add-new-form">Add New</Button>
                </div>
                <div className={styles.clearFloat}></div>
                <hr className={styles.hr} />
                <ul className={styles.businessFormList}>
                  <li>
                    <p>Business Form 1</p>
                    <button data-automation-id="btn-link-business-form1"><img className={styles.linkbutton} src={ArrowIconBlue} alt="Arrow" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  <li>
                    <p>Business Form 2</p>
                    <button data-automation-id="btn-link-business-form2"><img className={styles.linkbutton} src={ArrowIconBlue} alt="Arrow" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  <li>
                    <p>Business Form 3</p>
                    <button data-automation-id="btn-link-business-form3"><img className={styles.linkbutton} src={ArrowIconBlue} alt="Arrow" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  <li>
                    <p>Business Form 4</p>
                    <button data-automation-id="btn-link-business-form4"><img className={styles.linkbutton} src={ArrowIconBlue} alt="Arrow" /></button>
                    <div className={styles.clearFloat}></div>
                  </li>
                </ul>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <div className={styles.websiteInfoContainer}>
                <p><b>Website Settings</b></p>
                <div className={styles.clearFloat}></div>
                <hr className={styles.hr} />
                <ul className={styles.businessFormList}>
                  <li>
                    <p>Website Details</p>
                    <button data-automation-id="btn-link-websitedetails" onClick={() => { this.props.history.push('/MCAdmin/WebsiteManagement/EditWebsiteDetails'); }}><SettingIcon className={styles.settingLink} size="28" color="#8EB8C9" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  <li>
                    <p>Site URL</p>
                    <button data-automation-id="btn-link-siteurl"><SettingIcon className={styles.settingLink} size="28" color="#8EB8C9" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  <li>
                    <p>Website Status</p>
                    <button data-automation-id="btn-link-public-status" onClick={() => { this.props.history.push('/MCAdmin/WebsiteManagement/WebsiteSocialGoogle'); }}><SettingIcon className={styles.settingLink} size="28" color="#8EB8C9" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  { (localStorage.getItem('currentPlan') !== 'Web Only (no e-commerce)') &&
                    <li>
                      <p>eCommerce</p>
                      <button
                        data-automation-id="btn-link-ecommerce-switch"
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/MCAdmin/WebsiteManagement/WebsiteSocialGoogle',
                            search: '?location=eCommerceSetting',
                          });
                        }}
                      ><SettingIcon className={styles.settingLink} size="28" color="#8EB8C9" /></button>
                      <div className={styles.clearFloat}></div>
                      <hr className={styles.hr} />
                    </li>
                  }
                  <li>
                    <p>Template</p>
                    <button data-automation-id="btn-link-template"><SettingIcon className={styles.settingLink} size="28" color="#8EB8C9" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  <li>
                    <p>File Manager</p>
                    <button
                      data-automation-id="btn-link-file-manager"
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/MCAdmin/FileManager',
                        });
                      }}
                    ><SettingIcon className={styles.settingLink} size="28" color="#8EB8C9" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  <li>
                    <p>Social Media</p>
                    <button
                      data-automation-id="btn-link-social-media"
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/MCAdmin/WebsiteManagement/WebsiteSocialGoogle',
                          search: '?location=SocialMediaSetting',
                        });
                      }}
                    ><SettingIcon className={styles.settingLink} size="28" color="#8EB8C9" /></button>
                    <div className={styles.clearFloat}></div>
                    <hr className={styles.hr} />
                  </li>
                  <li>
                    <p>Google Analytics</p>
                    <button
                      data-automation-id="btn-link-google-analytic"
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/MCAdmin/WebsiteManagement/WebsiteSocialGoogle',
                          search: '?location=GoogleAnalyticsSetting',
                        });
                      }}
                    ><SettingIcon className={styles.settingLink} size="28" color="#8EB8C9" /></button>
                    <div className={styles.clearFloat}></div>
                  </li>
                </ul>
              </div>
              <div
                className={((localStorage.getItem('currentPlan') !== 'Web Only (no e-commerce)')) ? styles.domainNameContainer : styles.domainNameContainerHigher}
              >
                <p><b>Get a Domain Name for Your Site</b></p>
                <img src={RocketIcon} alt="Rocket" />
                <p>A domain name is your very own unique web address</p>
                <div>
                  <button data-automation-id="btn-link-domain"><img className={styles.linkbutton} src={ArrowIconWhite} alt="Arrow" /></button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Layout>);
  }
}

WebsiteManagement.propTypes = {
  history: PropTypes.object.isRequired,
};

export default WebsiteManagement;
