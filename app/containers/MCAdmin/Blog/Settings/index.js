import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import styles from './styles.css';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import Button from '../../../../components/Button';
import SuccessPopup from '../../../../components/SuccessPopup';
import ErrorPopup from '../../../../components/ErrorPopup';
import Loading from '../../../../components/Loading';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      submitMessage: '',
      showSuccessPopup: false,
      showDateCreated: true,
      showDateLastUpdated: true,
      showAuthor: true,
    };
  }

  componentDidMount() {
    request.get(
      `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogSetting`,
      {},
      (response) => {
        if (response.data) {
          this.setState({
            loading: false,
            showDateCreated: response.data.isShowBlogCreatedDate,
            showDateLastUpdated: response.data.IsShowBlogLastUpdateDate,
            showAuthor: response.data.isShowBlogAuthor,
          });
        } else {
          this.setState({
            error: response.error,
            loading: false,
          });
        }
      }
    );
  }

  handleChange(item) {
    if (item === 'showDateCreated') {
      this.setState({ showDateCreated: !this.state.showDateCreated });
    } else if (item === 'showDateLastUpdated') {
      this.setState({ showDateLastUpdated: !this.state.showDateLastUpdated });
    } else if (item === 'showAuthor') {
      this.setState({ showAuthor: !this.state.showAuthor });
    }
  }

  blogSettingSubmit() {
    this.setState({ loading: true });
    request.put(
    `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogSetting`,
      {
        IsShowBlogLastUpdateDate: this.state.showDateLastUpdated,
        IsShowBlogCreatedDate: this.state.showDateCreated,
        IsShowBlogAuthor: this.state.showAuthor,
      },
    (response) => {
      if (!response.error) {
        this.setState({
          submitMessage: 'Blog settings updated',
          showSuccessPopup: true,
          loading: false,
        });
      } else {
        this.setState({
          error: response.error,
          loading: false,
        });
      }
    });
  }

  render() {
    const popup = [];

    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          key="blogSettingsSuccessPopup"
          data-automation-id="dialog-blog-settings-success"
          onClose={() => { this.setState({ showSuccessPopup: false }); }}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="error-blog-settings-fail"
          key="Blog Settings Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-blogsettings">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-blog-link" key="Blog" onClick={() => this.props.history.push('/MCAdmin/Blog/Blog')}>Blog</button>,
            <button data-automation-id="btn-blogsettings-link" key="Settings" onClick={() => window.location.reload()}>Settings</button>,
          ]}
        />
        <h2>Settings</h2>
        <Box>
          <div>
            {this.state.loading && <Loading />}
            <Row style={{ marginBottom: '10px' }}>
              <Col xs={12} md={6}>
                <h3 style={{ float: 'left' }}>Show Date Created</h3>
                <div style={{ float: 'right', marginRight: '10px' }}>
                  <label htmlFor="Show Date Created" className={styles.switch}>
                    <input
                      data-automation-id="blogsettings-show-datecreated-checkbox"
                      className={styles.switchInput} type="checkbox"
                      checked={this.state.showDateCreated}
                      onChange={() => this.handleChange('showDateCreated')}
                    />
                    <span className={styles.switchLabel} data-on="Enable" data-off="Disable"></span>
                    <span className={styles.switchHandle}></span>
                  </label>
                </div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Col xs={12} md={6}>
                <h3 style={{ float: 'left' }}>Show Date Last Updated</h3>
                <div style={{ float: 'right', marginRight: '10px' }}>
                  <label htmlFor="show Date Last Updated" className={styles.switch}>
                    <input
                      data-automation-id="blogsettings-show-dateupdated-checkbox"
                      className={styles.switchInput} type="checkbox"
                      checked={this.state.showDateLastUpdated}
                      onChange={() => this.handleChange('showDateLastUpdated')}
                    />
                    <span className={styles.switchLabel} data-on="Enable" data-off="Disable"></span>
                    <span className={styles.switchHandle}></span>
                  </label>
                </div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col xs={12} md={6}>
                <h3 style={{ float: 'left' }}>Show Author</h3>
                <div style={{ float: 'right', marginRight: '10px' }}>
                  <label htmlFor="Show Author" className={styles.switch}>
                    <input
                      data-automation-id="blogsettings-show-author-checkbox"
                      className={styles.switchInput} type="checkbox"
                      checked={this.state.showAuthor}
                      onChange={() => this.handleChange('showAuthor')}
                    />
                    <span className={styles.switchLabel} data-on="Enable" data-off="Disable"></span>
                    <span className={styles.switchHandle}></span>
                  </label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={6}>
                <div className={styles.buttonFooter} >
                  <Button
                    data-automation-id="btn-blog-settings-submit"
                    onClick={() => this.blogSettingSubmit()}
                  >Save</Button>
                  <Button
                    data-automation-id="btn-blog-settings-cancel"
                    type="button"
                    btnStyle="negative"
                    onClick={() => this.props.history.push('/MCAdmin/Blog/Blog')}
                  >Cancel</Button>
                </div>
              </Col>
            </Row>
            {popup}
          </div>
        </Box>
      </Layout>);
  }
}

Settings.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Settings;
