import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router-dom';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';
import Button from '../../../../../components/Button';
import SuccessPopup from '../../../../../components/SuccessPopup';
import ErrorPopup from '../../../../../components/ErrorPopup';
import TextArea from '../../../../../components/TextArea';
import Loading from '../../../../../components/Loading';
import validate from '../../../../../utils/validate';
import styles from './styles.css';

export const GoogleAnalyticsFormValidate = (values) => {
  const errors = {};

  if (!values.get('googleTrackingCode')) {
    errors.googleTrackingCode = 'Please enter Google tracking code';
  }

  if (values.get('googleTrackingCode')) {
    const isValidLength = validate.isValidLength(values.get('googleTrackingCode'), 15, 'Google tracking code');
    const isValidCharacters = validate.isValidCharacters(values.get('googleTrackingCode'), '-');
    if (isValidLength !== true && isValidCharacters !== true) {
      errors.googleTrackingCode = `${isValidLength}.  ${isValidCharacters}.`;
    } else if (isValidLength !== true) {
      errors.googleTrackingCode = isValidLength;
    } else if (isValidCharacters !== true) {
      errors.googleTrackingCode = isValidCharacters;
    }
  }

  return errors;
};

class GoogleAnalyticsForm extends React.Component { // eslint-disable-line
  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
    };
  }

  componentDidMount() {
    request.get(
      `${apiUrl}/Websites/${localStorage.websiteID}/GoogleAnalytics`,
      {},
      (googleResponse) => {
        if (!googleResponse.error) {
          const initData = {
            googleTrackingCode: (googleResponse.data.GoogleAnalytic) ? googleResponse.data.GoogleAnalytic : '',
          };
          this.props.initialize(initData);
          this.setState({ loading: false });
        } else {
          this.setState({
            error: googleResponse.error,
            loading: false,
          });
        }
      }
    );
    if (this.props.jumptoBottom) {
      this.GoogleAnalyticsSetting.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submit(values) {
    this.setState({ loading: true });
    request.put(
    `${apiUrl}/Websites/${localStorage.websiteID}/GoogleAnalytics`,
      {
        Id: localStorage.websiteID,
        GoogleAnalytic: values.get('googleTrackingCode'),
      },
    (googleResponse) => {
      if (!googleResponse.error) {
        this.setState({
          submitMessage: 'Google analytics tracking code updated',
          showSuccessPopup: true,
          loading: false,
        });
      } else {
        this.setState({
          error: googleResponse.error,
          loading: false,
        });
      }
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const popup = [];
    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          id="showSuccessPopup"
          key="Google Analytics Success"
          data-automation-id="dialog-google-analytics-success"
          onClose={() => this.setState({ showSuccessPopup: false, submitMessage: false })}
        >
          <h3>You have been successful</h3>
          <div> {this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="dialog-google-analytics-fail"
          key="Google Analytics error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <div ref={(node) => { this.GoogleAnalyticsSetting = node; }}>
        {this.state.loading && <Loading />}
        <form data-automation-id="form-google-analytics" onSubmit={handleSubmit((values) => { this.submit(values); })}>
          <Row>
            <Col xs={12} md={6}>
              <Field data-automation-id="field-google-code" label="Tracking Code" name="googleTrackingCode" type="text" component={TextArea} rows={5} />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6}>
              <div className={styles.buttonFooter}>
                <Button data-automation-id="btn-google-analytics-submit" type="submit">Save</Button>
                <Button data-automation-id="btn-google-analytics-cancel" type="button" btnStyle="negative" onClick={() => this.props.history.push('/MCAdmin/WebsiteManagement')}>Cancel</Button>
              </div>
            </Col>
          </Row>
        </form>
        {popup}
      </div>
    );
  }
}

GoogleAnalyticsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  jumptoBottom: PropTypes.bool.isRequired,
};

export default reduxForm({ // eslint-disable-line
  form: 'GoogleAnalyticsForm',
  validate: GoogleAnalyticsFormValidate,
})(withRouter((GoogleAnalyticsForm)));
