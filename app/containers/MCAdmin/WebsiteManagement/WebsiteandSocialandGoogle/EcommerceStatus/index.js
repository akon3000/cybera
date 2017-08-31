import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router-dom';
import Toggle from 'material-ui/Toggle';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';
import Button from '../../../../../components/Button';
import SuccessPopup from '../../../../../components/SuccessPopup';
import ErrorPopup from '../../../../../components/ErrorPopup';
import styles from './styles.css';

class EcommerceStatus extends React.Component { // eslint-disable-line
  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
      eCommerce: false,
    };
  }

  componentDidMount() {
    request.get(
      `${apiUrl}/Websites/${localStorage.websiteID}/ManageWebsite`,
      {},
      (response) => {
        if (!response.error) {
          this.setState({
            eCommerce: response.data.IsOpenedEcommerceFunction,
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
    if (this.props.jumptoBottom) {
      this.eCommerceSetting.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submit() {
    this.setState({ loading: true });
    request.put(
    `${apiUrl}/Websites/${localStorage.websiteID}/OpenEcommerceFunction`,
      {
        Id: localStorage.websiteID,
        IsOpenedEcommerceFunction: this.state.eCommerce,
      },
    (response) => {
      if (!response.error) {
        this.setState({
          submitMessage: 'eCommerce status has been saved',
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

  ToggleStatus() {
    if (this.state.eCommerce) {
      this.setState({ eCommerce: false });
    } else {
      this.setState({ eCommerce: true });
    }
  }

  render() {
    const popup = [];
    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          id="showSuccessPopup"
          key="eCommerce Status Success"
          data-automation-id="dialog-ecommerce-success"
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
          data-automation-id="dialog-ecommerce-fail"
          key="eCommerce Status error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <div ref={(node) => { this.eCommerceSetting = node; }}>
        <Row>
          <Col xs={12}><h3>eCommerce Status</h3></Col>
          <Col xs={12} md={2}>
            <Toggle data-automation-id="toggle-ecommerce-status" onClick={() => this.ToggleStatus()} defaultToggled={this.state.eCommerce} style={{ marginTop: '10px' }} />
          </Col>
          <Col xs={12} sm={12} md={4}>
            <div className={styles.buttonFooter}>
              <Button data-automation-id="btn-ecommerce-status-submit" onClick={() => this.submit()}>Save</Button>
              <Button data-automation-id="btn-ecommerce-cancel" btnStyle="negative" onClick={() => this.props.history.push('/MCAdmin/WebsiteManagement')}>Cancel</Button>
            </div>
          </Col>
        </Row>
        {popup}
      </div>
    );
  }
}

EcommerceStatus.propTypes = {
  history: PropTypes.object.isRequired,
  jumptoBottom: PropTypes.bool.isRequired,
};
export default (withRouter((EcommerceStatus)));
