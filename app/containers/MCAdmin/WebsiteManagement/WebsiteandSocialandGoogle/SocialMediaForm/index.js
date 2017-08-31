import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router-dom';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';
import Button from '../../../../../components/Button';
import CheckBox from '../../../../../components/CheckBox';
import SuccessPopup from '../../../../../components/SuccessPopup';
// import Dialog from '../../../../../components/Dialog';
import ErrorPopup from '../../../../../components/ErrorPopup';
import Loading from '../../../../../components/Loading';
import validate from '../../../../../utils/validate';
import styles from './styles.css';

class SocialMediaForm extends React.Component { // eslint-disable-line
  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
      facebookShare: false,
      twitterShare: false,
      instagramShare: false,
      emptyInput: false,
      facebookValue: '',
      twitterValue: '',
      instagramValue: '',
      youtubeValue: '',
      facebookValid: true,
      twitterValid: true,
      instagramValid: true,
      youtubeValid: true,
      facebookValidationMessage: '',
      twitterValidationMessage: '',
      instagramValidationMessage: '',
      youtubeValidationMessage: '',
      showSuccessPopup: false,
      submitMessage: '',
      emptyfacebookShareLink: false,
      emptytwitterShareLink: false,
      emptyinstagramShareLink: false,
    };
  }

  componentDidMount() {
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/SocialNetworks`, {},
    (response) => {
      if (!response.error) {
        this.setState({
          facebookValue: (response.data.Facebook.UrlFacebook) ? response.data.Facebook.UrlFacebook : '',
          facebookShare: response.data.Facebook.AllowFacebookShare,
          twitterValue: (response.data.Twitter.UrlTwitter) ? response.data.Twitter.UrlTwitter : '',
          twitterShare: response.data.Twitter.AllowTwitterShare,
          instagramValue: (response.data.Instagram.UrlInstagram) ? response.data.Instagram.UrlInstagram : '',
          instagramShare: response.data.Instagram.AllowInstagramShare,
          youtubeValue: (response.data.Youtube.UrlYoutube) ? response.data.Youtube.UrlYoutube : '',
          loading: false,
        });
      } else {
        this.setState({
          error: response.error,
          loading: false,
        });
      }
    });
    if (this.props.jumptoBottom) {
      this.SocialMediaSetting.scrollIntoView({ behavior: 'smooth' });
    }
  }

  inputValidation() {
    if (this.state.facebookValue) {
      const isFacebookValidLength = validate.isValidLength(this.state.facebookValue, 50, 'Facebook link');
      const isFacebookValidCharacters = validate.isValidCharacters(this.state.facebookValue, '-_/');
      if (isFacebookValidLength === true && isFacebookValidCharacters === true) {
        this.setState({ facebookValid: true });
      } else {
        this.setState({ facebookValid: false });
      }

      if (isFacebookValidLength !== true && isFacebookValidCharacters !== true) {
        this.setState({ facebookValidationMessage: `${isFacebookValidLength}.  ${isFacebookValidCharacters}.` });
      } else if (isFacebookValidLength !== true) {
        this.setState({ facebookValidationMessage: isFacebookValidLength });
      } else if (isFacebookValidCharacters !== true) {
        this.setState({ facebookValidationMessage: isFacebookValidCharacters });
      }
    } else if (!this.state.facebookValue) {
      this.setState({ facebookValid: true });
    }

    if (this.state.twitterValue) {
      const isTwitterValidLength = validate.isValidLength(this.state.twitterValue, 50, 'Twitter link');
      const isTwitterValidCharacters = validate.isValidCharacters(this.state.twitterValue, '-_/');
      if (isTwitterValidLength === true && isTwitterValidCharacters === true) {
        this.setState({ twitterValid: true });
      } else {
        this.setState({ twitterValid: false });
      }

      if (isTwitterValidLength !== true && isTwitterValidCharacters !== true) {
        this.setState({ twitterValidationMessage: `${isTwitterValidLength}.  ${isTwitterValidCharacters}.` });
      } else if (isTwitterValidLength !== true) {
        this.setState({ twitterValidationMessage: isTwitterValidLength });
      } else if (isTwitterValidCharacters !== true) {
        this.setState({ twitterValidationMessage: isTwitterValidCharacters });
      }
    } else if (!this.state.twitterValue) {
      this.setState({ twitterValid: true });
    }

    if (this.state.instagramValue) {
      const isInstagramValidLength = validate.isValidLength(this.state.instagramValue, 50, 'Instagram link');
      const isInstagramValidCharacters = validate.isValidCharacters(this.state.instagramValue, '-_/');
      if (isInstagramValidLength === true && isInstagramValidCharacters === true) {
        this.setState({ instagramValid: true });
      } else {
        this.setState({ instagramValid: false });
      }

      if (isInstagramValidLength !== true && isInstagramValidCharacters !== true) {
        this.setState({ instagramValidationMessage: `${isInstagramValidLength}.  ${isInstagramValidCharacters}.` });
      } else if (isInstagramValidLength !== true) {
        this.setState({ instagramValidationMessage: isInstagramValidLength });
      } else if (isInstagramValidCharacters !== true) {
        this.setState({ instagramValidationMessage: isInstagramValidCharacters });
      }
    } else if (!this.state.instagramValue) {
      this.setState({ instagramValid: true });
    }

    if (this.state.youtubeValue) {
      const isYoutubeValidLength = validate.isValidLength(this.state.youtubeValue, 50, 'Youtube link');
      const isYoutubeValidCharacters = validate.isValidCharacters(this.state.youtubeValue, '-_/');
      if (isYoutubeValidLength === true && isYoutubeValidCharacters === true) {
        this.setState({ youtubeValid: true });
      } else {
        this.setState({ youtubeValid: false });
      }

      if (isYoutubeValidLength !== true && isYoutubeValidCharacters !== true) {
        this.setState({ youtubeValidationMessage: `${isYoutubeValidLength}.  ${isYoutubeValidCharacters}.` });
      } else if (isYoutubeValidLength !== true) {
        this.setState({ youtubeValidationMessage: isYoutubeValidLength });
      } else if (isYoutubeValidCharacters !== true) {
        this.setState({ youtubeValidationMessage: isYoutubeValidCharacters });
      }
    } else if (!this.state.youtubeValue) {
      this.setState({ youtubeValid: true });
    }
  }

  submit() {
    if (!this.state.facebookValue && !this.state.twitterValue && !this.state.instagramValue && !this.state.youtubeValue) {
      this.setState({ emptyInput: true });
    } else if ((this.state.facebookShare && !this.state.facebookValue) || (this.state.twitterShare && !this.state.twitterValue) ||
    (this.state.instagramShare && !this.state.instagramValue)) {
      if (this.state.facebookShare && !this.state.facebookValue) {
        this.setState({ emptyfacebookShareLink: true });
      }
      if (this.state.twitterShare && !this.state.twitterValue) {
        this.setState({ emptytwitterShareLink: true });
      }
      if (this.state.instagramShare && !this.state.instagramValue) {
        this.setState({ emptyinstagramShareLink: true });
      }
    } else if (this.state.facebookValid && this.state.twitterValid && this.state.instagramValid && this.state.youtubeValid) {
      this.setState({ loading: true });
      request.put(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/SocialNetworks`,
        {
          UrlFacebook: (this.state.facebookValue) ? this.state.facebookValue : '',
          AllowFacebookShare: this.state.facebookShare,
          UrlTwitter: (this.state.twitterValue) ? this.state.twitterValue : '',
          AllowTwitterShare: this.state.twitterShare,
          UrlInstagram: (this.state.instagramValue) ? this.state.instagramValue : '',
          AllowInstagramShare: this.state.instagramShare,
          UrlYoutube: (this.state.youtubeValue) ? this.state.youtubeValue : '',
        },
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Social media link updated',
              showSuccessPopup: true,
              loading: false,
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
  }

  render() {
    const popup = [];
    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          id="showSuccessPopup"
          key="Social Media Success"
          data-automation-id="dialog-social-media-success"
          onClose={() => this.setState({ showSuccessPopup: false, submitMessage: false })}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="dialog-social-media-fail"
          key="Social Media Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <div ref={(node) => { this.SocialMediaSetting = node; }}>
        {this.state.loading && <Loading />}
        <form>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <div>
                <label htmlFor="Facebook"><h3>Facebook</h3></label>
                <div style={{ display: 'table', width: '100%' }}>
                  <div className={styles.hintText}>www.facebook.com/</div>
                  <div style={{ display: 'table-cell' }}>
                    <input
                      data-automation-id="field-facebook-link"
                      type="text"
                      className={styles.inputText}
                      value={this.state.facebookValue}
                      onChange={(event) => {
                        this.setState({
                          facebookValue: event.target.value,
                          emptyInput: false,
                          emptyfacebookShareLink: false,
                        }, () => {
                          this.inputValidation();
                        });
                      }}
                    />
                    <hr className={styles.hr} />
                  </div>
                </div>
              </div>
              { !this.state.facebookValid &&
                <div className={styles.warnText}>{this.state.facebookValidationMessage}</div>
              }
              { this.state.emptyfacebookShareLink &&
                <div className={styles.warnText}>Please enter facebook link</div>
              }
            </Col>
            <Col xs={12} sm={12} md={6}>
              <label htmlFor="facebookShare">&nbsp;</label>
              <Field
                data-automation-id="field-facebook-share"
                label="Allow user to share the product" name="facebookShare" type="text" component={CheckBox}
                checked={this.state.facebookShare}
                value={this.state.facebookShare}
                onCheck={(facebookShare) => {
                  this.setState({
                    facebookShare,
                    emptyfacebookShareLink: false,
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <div>
                <label htmlFor="Twitter"><h3>Twitter</h3></label>
                <div style={{ display: 'table', width: '100%' }}>
                  <div className={styles.hintText}>www.twitter.com/</div>
                  <div style={{ display: 'table-cell' }}>
                    <input
                      data-automation-id="field-twitter-link"
                      type="text"
                      className={styles.inputText}
                      value={this.state.twitterValue}
                      onChange={(event) => {
                        this.setState({
                          twitterValue: event.target.value,
                          emptyInput: false,
                          emptytwitterShareLink: false,
                        }, () => {
                          this.inputValidation();
                        });
                      }}
                    />
                    <hr className={styles.hr} />
                  </div>
                </div>
              </div>
              { !this.state.twitterValid &&
                <div className={styles.warnText}>{this.state.twitterValidationMessage}</div>
              }
              { this.state.emptytwitterShareLink &&
                <div className={styles.warnText}>Please enter twitter link</div>
              }
            </Col>
            <Col xs={12} sm={12} md={6}>
              <label htmlFor="twitterShare">&nbsp;</label>
              <Field
                data-automation-id="field-twitter-share"
                label="Allow user to share the product" name="twitterShare" type="text" component={CheckBox}
                checked={this.state.twitterShare}
                value={this.state.twitterShare}
                onCheck={(twitterShare) => {
                  this.setState({
                    twitterShare,
                    emptytwitterShareLink: false,
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <div>
                <label htmlFor="Instagram"><h3>Instagram</h3></label>
                <div style={{ display: 'table', width: '100%' }}>
                  <div className={styles.hintText}>www.instagram.com/</div>
                  <div style={{ display: 'table-cell' }}>
                    <input
                      data-automation-id="field-instagram-link"
                      type="text"
                      className={styles.inputText}
                      value={this.state.instagramValue}
                      onChange={(event) => {
                        this.setState({
                          instagramValue: event.target.value,
                          emptyInput: false,
                          emptyinstagramShareLink: false,
                        }, () => {
                          this.inputValidation();
                        });
                      }}
                    />
                    <hr className={styles.hr} />
                  </div>
                </div>
              </div>
              { !this.state.instagramValid &&
                <div className={styles.warnText}>{this.state.instagramValidationMessage}</div>
              }
              { this.state.emptyinstagramShareLink &&
                <div className={styles.warnText}>Please enter instagram link</div>
              }
            </Col>
            <Col xs={12} sm={12} md={6}>
              <label htmlFor="instagramShare">&nbsp;</label>
              <Field
                data-automation-id="field-instagram-share"
                label="Allow user to share the product" name="instagramShare" type="text" component={CheckBox}
                checked={this.state.instagramShare}
                value={this.state.instagramShare}
                onCheck={(instagramShare) => {
                  this.setState({
                    instagramShare,
                    emptyinstagramShareLink: false,
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <div>
                <label htmlFor="Youtube"><h3>Youtube</h3></label>
                <div style={{ display: 'table', width: '100%' }}>
                  <div className={styles.hintText}>www.youtube.com/user/</div>
                  <div style={{ display: 'table-cell' }}>
                    <input
                      data-automation-id="field-youtube-link"
                      type="text"
                      className={styles.inputText}
                      value={this.state.youtubeValue}
                      onChange={(event) => {
                        this.setState({
                          youtubeValue: event.target.value,
                          emptyInput: false,
                        }, () => {
                          this.inputValidation();
                        });
                      }}
                    />
                    <hr className={styles.hr} />
                  </div>
                </div>
              </div>
              { !this.state.youtubeValid &&
                <div className={styles.warnText}>{this.state.youtubeValidationMessage}</div>
              }
            </Col>
          </Row>
        </form>
        { this.state.emptyInput &&
          <div className={styles.warnText}>Please enter at least one social media link</div>
        }
        <Row>
          <Col xs={12} sm={12} md={6}>
            <div className={styles.buttonFooter}>
              <Button data-automation-id="btn-social-media-submit" onClick={() => this.submit()}>Save</Button>
              <Button data-automation-id="btn-social-media-cancel" btnStyle="negative" onClick={() => this.props.history.push('/MCAdmin/WebsiteManagement')}>Cancel</Button>
            </div>
          </Col>
        </Row>
        {popup}
      </div>
    );
  }
}

SocialMediaForm.propTypes = {
  history: PropTypes.object.isRequired,
  jumptoBottom: PropTypes.bool.isRequired,
};

export default reduxForm({ // eslint-disable-line
  form: 'SocialMediaForm',
})(withRouter((SocialMediaForm)));
