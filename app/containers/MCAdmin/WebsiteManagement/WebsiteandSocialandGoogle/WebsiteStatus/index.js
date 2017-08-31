import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';
import Button from '../../../../../components/Button';
import ConfirmPopup from '../../../../../components/ConfirmPopup';
import ErrorPopup from '../../../../../components/ErrorPopup';
import Loading from '../../../../../components/Loading';
import styles from './styles.css';

class WebsiteStatusForm extends React.Component { // eslint-disable-line
  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
      Websitepublish: false,
      ecommerceOn: false,
      openWebsiteConfirmation: false,
      openEcommerceConfirmation: false,
    };
  }

  componentDidMount() {
    request.get(
      `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/ManageWebsite`,
      {},
      (response) => {
        if (!response.error) {
          this.setState({
            loading: false,
            Websitepublish: !response.data.IsMaintenance,
            ecommerceOn: response.data.IsOpenedEcommerceFunction,
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

  handleWebsiteStatusChange() {
    this.setState({
      openWebsiteConfirmation: true,
      Websitepublish: !this.state.Websitepublish,
    });
  }

  handleECommerceStatusChange() {
    this.setState({
      openEcommerceConfirmation: true,
      ecommerceOn: !this.state.ecommerceOn,
    });
  }

  WebsiteStatusSubmit() {
    this.setState({
      loading: true,
      openWebsiteConfirmation: false,
    });
    request.put(
    `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Maintenance`,
      {
        Id: localStorage.getItem('websiteID'),
        IsMaintenance: !this.state.Websitepublish,
      },
    (response) => {
      if (!response.error) {
        this.setState({
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

  eCommerceStatusSubmit() {
    this.setState({
      loading: true,
      openEcommerceConfirmation: false,
    });
    request.put(
    `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/OpenEcommerceFunction`,
      {
        Id: localStorage.getItem('websiteID'),
        IsOpenedEcommerceFunction: this.state.ecommerceOn,
      },
    (response) => {
      if (!response.error) {
        this.setState({
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
    if (this.state.openWebsiteConfirmation) {
      popup.push(
        <ConfirmPopup
          key="showWebsiteConfirmation"
          data-automation-id="dialog-website-status-confirmation"
          onClose={() => this.setState({ openWebsiteConfirmation: false, Websitepublish: !this.state.Websitepublish })}
          actions={[
            <Button data-automation-id="btn-yes" onClick={() => this.WebsiteStatusSubmit()}>Yes</Button>,
            <Button
              btnStyle="negative"
              onClick={() => {
                this.setState({ openWebsiteConfirmation: false, Websitepublish: !this.state.Websitepublish });
              }}
              data-automation-id="btn-no"
            >No</Button>,
          ]}
        >
          <h3>Website Status Setting</h3>
          { this.state.Websitepublish && <div>Are you sure to publish your website?</div> }
          { !this.state.Websitepublish && <div>Are you sure to put your website in maintenance mode?</div> }
        </ConfirmPopup>
      );
    }

    if (this.state.openEcommerceConfirmation) {
      popup.push(
        <ConfirmPopup
          key="showecommerceConfirmation"
          data-automation-id="dialog-ecommerce-status-confirmation"
          onClose={() => this.setState({ openEcommerceConfirmation: false, ecommerceOn: !this.state.ecommerceOn })}
          actions={[
            <Button data-automation-id="btn-yes" onClick={() => this.eCommerceStatusSubmit()}>Yes</Button>,
            <Button
              btnStyle="negative"
              data-automation-id="btn-no"
              onClick={() => {
                this.setState({ openEcommerceConfirmation: false, ecommerceOn: !this.state.ecommerceOn });
              }}
            >No</Button>,
          ]}
        >
          <h3>eCommerce Status Setting</h3>
          { this.state.ecommerceOn && <div>Are you sure to activate your eCommerce?</div> }
          { !this.state.ecommerceOn && <div>Are you sure to deactivate your eCommerce?</div> }
        </ConfirmPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="dialog-website-status-fail"
          key="Website Status error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <div>
        {this.state.loading && <Loading />}
        <Row>
          <Col xs={12} md={6}>
            <h3 style={{ float: 'left' }}>Website Status</h3>
            <div style={{ float: 'right', marginRight: '10px' }}>
              <label htmlFor="Website Status" className={styles.switch}>
                <input
                  data-automation-id="website-status-checkbox"
                  className={styles.switchInput} type="checkbox"
                  checked={this.state.Websitepublish}
                  onChange={() => this.handleWebsiteStatusChange()}
                />
                <span className={styles.switchLabel} data-on="Publish" data-off="Maintenance"></span>
                <span className={styles.switchHandle}></span>
              </label>
            </div>
          </Col>
        </Row>
        { (localStorage.getItem('currentPlan') !== 'Web Only (no e-commerce)') &&
        <Row style={{ marginTop: '10px' }}>
          <Col xs={12} md={6}>
            <h3 style={{ float: 'left', textTransform: 'none' }}>eCommerce Status</h3>
            <div style={{ float: 'right', marginRight: '70px' }}>
              <label htmlFor="eCommerce Status" className={styles.switch1}>
                <input
                  data-automation-id="ecommerce-status-checkbox"
                  className={styles.switchInput1} type="checkbox"
                  checked={this.state.ecommerceOn}
                  onChange={() => this.handleECommerceStatusChange()}
                />
                <span className={styles.switchLabel1} data-on="On" data-off="Off"></span>
                <span className={styles.switchHandle1}></span>
              </label>
            </div>
          </Col>
        </Row>
        }
        {popup}
      </div>
    );
  }
}

export default WebsiteStatusForm;
