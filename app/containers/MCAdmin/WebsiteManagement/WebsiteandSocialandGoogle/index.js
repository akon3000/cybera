import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
// import styles from './styles.css';
import WebsiteStatus from './WebsiteStatus';
import SocialMediaForm from './SocialMediaForm';
import GoogleAnalyticsForm from './GoogleAnalyticsForm';


class WebsiteandSocialandGoogle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location.query.location,
    };
  }

  render() {
    return (<Layout data-automation-id="page-website-ecommerce-social-google">
      <BreadCrumb
        breadCrumb={[
          <button data-automation-id="btn-website-management-link" key="Website Management Details" onClick={() => this.props.history.push('/MCAdmin/WebsiteManagement')}>Website Management</button>,
          <button data-automation-id="btn-website-ecommerce-social-google-link" key="Website & eCommerce & Social Media & Google Analytics Management" onClick={() => window.location.reload()}>Settings</button>,
        ]}
      />
      <h2>Website Settings</h2>
      <Box>
        <WebsiteStatus />
      </Box>
      <div>
        <h2>Set Up Social Media Links</h2>
        <Box>
          <SocialMediaForm jumptoBottom={this.state.location === 'SocialMediaSetting'} />
        </Box>
      </div>
      <div>
        <h2>Set Up Google Analytics</h2>
        <Box>
          <GoogleAnalyticsForm jumptoBottom={this.state.location === 'GoogleAnalyticsSetting'} />
        </Box>
      </div>
    </Layout>);
  }
}

WebsiteandSocialandGoogle.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default WebsiteandSocialandGoogle;
