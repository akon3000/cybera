import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlusIcon from 'react-icons/lib/fa/plus';

import styles from './styles.css';
import paymentIcon from './credit-cards-payment.svg';
import SettingPage from './setting';
import Layout from '../Layout';
import Loading from '../../../components/Loading';
import Button from '../../../components/Button';
import ProviderPopup from './ProviderPopup';
import ErrorPopup from '../../../components/ErrorPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import Box from '../../../components/AdminLayout/components/Box';
import Tap from '../../../components/Tap';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import { apiUrl } from '../../../config';
import request from '../../../utils/request';

/** import Payment Provider */
import PaypalProvider from './ProviderComponents/paypal';
import NabProvider from './ProviderComponents/nab';
import SecurepayProvider from './ProviderComponents/securepay';
import PaystreamProvider from './ProviderComponents/paystream';
import MerchantwarriorProvider from './ProviderComponents/merchantwarrior';
import StripeProvider from './ProviderComponents/stripe';
import EwayProvider from './ProviderComponents/eway';
import AnzProvider from './ProviderComponents/anz';
import CommonwealthProvider from './ProviderComponents/commonwealth';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: true,
      tabActive: 'PaymentProvider',
      showProviderPopup: false,
      showSuccesPopup: false,
      orders: [],
      popup: {},
      PaymentProvider: [],
      PaymentProviderSelects: {},
      isPaymentProviderSelects: {},
      isEmptyProvider: false,
      error: false,
    };
  }

  componentWillMount() {
    this.getPaymentProvider();
  }

  onPopup(ProviderName, event) {
    const popup = this.state.popup;
    let orders = this.state.orders;
    const isPaymentProviderSelects = this.state.isPaymentProviderSelects;
    switch (event) {
      case 'open': popup[ProviderName] = true; break;
      case 'close':
        popup[ProviderName] = false;
        if (this.state.PaymentProviderSelects[ProviderName] === null) {
          isPaymentProviderSelects[ProviderName] = false;
          if (orders.length === 1 && orders[0] === ProviderName) {
            orders = [];
          } else {
            delete orders[orders.indexOf(ProviderName)];
          }
        }
        break;
      default: break;
    }
    this.setState({ popup, isPaymentProviderSelects, orders });
  }

  getPaymentProvider() {
    const self = this;
    let isPayment = false;
    let isWebsitePayment = false;

    self.setState({ Loading: true });

    request.get(`${apiUrl}/Payments`, {}, (response) => {
      if (!response.error) {
        if (response.data.Items) {
          self.setState({ PaymentProvider: response.data.Items });
        }
      } else {
        self.setState({ error: response.error });
      }
      isPayment = true;
      if (isPayment && isWebsitePayment) self.setState({ Loading: false });
    });
    request.get(`${apiUrl}/Websites/${localStorage.websiteID}/Payments`, {}, (response) => {
      if (!response.error) {
        if (response.data) {
          const orders = [];
          const popup = {};
          const isPaymentProviderSelects = {};
          const isEmptyProvider = Object.keys(response.data).every((key) => response.data[key] === null);
          Object.keys(response.data).forEach((key) => {
            popup[key] = false;
            isPaymentProviderSelects[key] = response.data[key] !== null;
            if (response.data[key] !== null) orders.push(key);
          });
          self.setState({ isPaymentProviderSelects, isEmptyProvider, orders, popup, PaymentProviderSelects: response.data });
        }
      } else {
        self.setState({ error: response.error });
      }
      isWebsitePayment = true;
      if (isPayment && isWebsitePayment) self.setState({ Loading: false });
    });
  }

  removeProvider(ProviderName, response = {}) {
    if (response.error) {
      this.setState({ error: response.error });
    } else {
      const PaymentProviderSelects = this.state.PaymentProviderSelects;
      const isPaymentProviderSelects = this.state.isPaymentProviderSelects;
      let orders = this.state.orders;
      const popup = this.state.popup;
      if (orders.length === 1 && orders[0] === ProviderName) {
        orders = [];
      } else {
        delete orders[orders.indexOf(ProviderName)];
      }
      popup[ProviderName] = false;
      PaymentProviderSelects[ProviderName] = null;
      isPaymentProviderSelects[ProviderName] = false;
      this.setState({ popup, orders, PaymentProviderSelects, isPaymentProviderSelects }, () => {
        const isEmptyProvider = Object.keys(this.state.isPaymentProviderSelects).every((key) => !this.state.isPaymentProviderSelects[key]);
        this.setState({ isEmptyProvider });
      });
    }
  }

  submitProvider(ProviderName, response, name) {
    const popup = this.state.popup;
    popup[ProviderName] = false;
    if (response.error) {
      this.setState({ error: response.status || response.error, popup });
    } else {
      const PaymentProviderSelects = this.state.PaymentProviderSelects;
      PaymentProviderSelects[ProviderName] = response.data;
      this.setState({
        popup,
        PaymentProviderSelects,
        showSuccesPopup: true,
        isEmptyProvider: false,
        msgSuccess: `${name} details has been updated.`,
      });
    }
  }

  mapProvider(newProvider) {
    let mapProvider = null;
    switch (newProvider) {
      case 'Paypal':
        mapProvider = (
          <PaypalProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      case 'Nab':
        mapProvider = (
          <NabProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      case 'Anz':
        mapProvider = (
          <AnzProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      case 'Commonwealth':
        mapProvider = (
          <CommonwealthProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      case 'eWay':
        mapProvider = (
          <EwayProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      case 'Merchantwarrior':
        mapProvider = (
          <MerchantwarriorProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      case 'Paystream':
        mapProvider = (
          <PaystreamProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      case 'Securepay':
        mapProvider = (
          <SecurepayProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      case 'Stripe':
        mapProvider = (
          <StripeProvider
            key={`${newProvider}`}
            name={`${newProvider}`}
            open={this.state.popup[newProvider]}
            onOpen={() => this.onPopup(newProvider, 'open')}
            onClose={() => this.onPopup(newProvider, 'close')}
            data={this.state.PaymentProviderSelects[newProvider]}
            onSubmit={(Providername, res, name) => this.submitProvider(Providername, res, name)}
            onRemove={(Providername, res) => this.removeProvider(Providername, res)}
          />
        );
        break;
      default: break;
    }
    return mapProvider;
  }

  render() {
    const breadCrumb = [
      <button key="Shop" data-automation-id="breadCrumb-Shop" onClick={() => window.location.reload()}>Shop</button>,
      <button key="Payment" data-automation-id="breadCrumb-payment" onClick={() => window.location.reload()}>Payment</button>,
    ];

    const tabs = [
      <button key="PaymentProvider" data-automation-id="tab-payment-provider" onClick={() => this.setState({ tabActive: 'PaymentProvider' })}>Payment Provider</button>,
      <button key="Setting" data-automation-id="tab-setting" onClick={() => this.setState({ tabActive: 'Setting' })}>Setting</button>,
    ];

    return this.state.Loading ? <Loading /> : (
      <Layout data-automation-id="page-payment">

        <BreadCrumb breadCrumb={breadCrumb} />

        <h2>Payment Methods</h2>
        <Box className={styles.box}>
          <Tap tabs={tabs} active={this.state.tabActive} />
          { this.state.tabActive === 'PaymentProvider' &&
            <div className={styles.container}>
              <div className={styles.addPaymentProvider}>
                { this.state.isEmptyProvider &&
                  <div className={styles.noMethod}>
                    <img alt="card" src={paymentIcon} />
                    <h1>No Payment Method</h1>
                    <Button data-automation-id="btn-addPaymentMethod" onClick={() => this.setState({ showProviderPopup: true })}>
                      <PlusIcon /> Payment Method
                    </Button>
                  </div>
                }
                { !this.state.isEmptyProvider &&
                  <div>
                    {
                      Object.keys(this.state.isPaymentProviderSelects).every((key) => this.state.isPaymentProviderSelects[key] === true) ? '' :
                      <Button data-automation-id="btn-addPaymentMethod" onClick={() => this.setState({ showProviderPopup: true })}>
                        <PlusIcon /> Payment Method
                      </Button>
                    }
                  </div>
                }
              </div>

            </div>
          }
          { this.state.tabActive === 'Setting' &&
            <SettingPage />
          }
        </Box>

        { /** Provider List */
          this.state.tabActive === 'PaymentProvider' && this.state.orders.map((key) => this.mapProvider(key))
        }

        { this.state.showSuccesPopup &&
          <SuccessPopup
            data-automation-id="popup-payment-provider-save-success"
            onClose={() => this.setState({ showSuccesPopup: false })}
          >
            <h3>You have been successful</h3>
            <div>{this.state.msgSuccess}</div>
          </SuccessPopup>
        }

        <ProviderPopup
          open={this.state.showProviderPopup}
          provider={this.state.PaymentProvider}
          providerSelect={this.state.isPaymentProviderSelects}
          onClose={() => this.setState({ showProviderPopup: false })}
          onSelect={(Provider) => {
            const isPaymentProviderSelects = this.state.isPaymentProviderSelects;
            const popup = this.state.popup;
            const orders = [Provider.Name].concat(this.state.orders);
            isPaymentProviderSelects[Provider.Name] = true;
            popup[Provider.Name] = true;
            this.setState({ orders, popup, isPaymentProviderSelects, showProviderPopup: false });
          }}
        />

        { /** Error Request */
          this.state.error &&
          <ErrorPopup error={this.state.error} onClose={() => this.setState({ error: false })} />
        }

      </Layout>
    );
  }
}

Payment.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Payment;
