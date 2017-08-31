import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Dialog from '../../../components/Dialog';
import Button from '../../../components/Button';
import ErrorPopup from '../../../components/ErrorPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import styles from './styles.css';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';
import { formatDate } from '../../../utils';
import auth from '../../../utils/auth';

import CancelSubscription from './CancelSubscription';
import DisableAutoRenewal from './DisableAutoRenewal';
import PaymentPopup from '../../../components/PaymentPopup';
import SubscribeImg from './subscribe.png';

class Subscription extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showCancelSubscription: false,
      websiteID: localStorage.getItem('websiteID'),
      showAutoRenewalButton: false,
      showEnableAutoRenewalPopup: false,
      pendingPlan: false,
      enableAutoRenewalSuccess: false,
      error: false,
    };
  }

  componentDidMount() {
    this.updateCurrentPlan();
  }

  updateCurrentPlan() {
    this.setState({ isLoading: true });
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/WebsitePlan/false`, {}, (response) => {
      if (!response.error) {
        if (response.data) {
          this.setState({
            plan: response.data.PlanDetail.Name,
            amount: response.data.PaymentScheduleStatus === 'Month' ?
                    response.data.PlanDetail.Price :
                    response.data.PlanDetail.PricePerYear,
            billingCycle: response.data.PaymentScheduleStatus,
            isAutoRenewal: response.data.IsAutoRenewal,
            nextPayment: response.data.EndDate,
            currentPlan: response.data.PlanDetail,
          }, () => {
            let showAutoRenewalButton = true;

            auth.getWebsite((website) => {
              if (website.PaymentStatus !== 'Paid') {
                showAutoRenewalButton = false;
              }
              const nextPayment = new Date(this.state.nextPayment);
              const tenDaysBeforeExpire = nextPayment.setDate(nextPayment.getDate() - 10);
              const aboutToExpire = tenDaysBeforeExpire <= new Date();
              this.setState({
                showPaymentButton: (aboutToExpire && !this.state.isAutoRenewal) || website.PaymentStatus === 'Overdue',
                isLoading: false,
                showAutoRenewalButton,
                showDisableAutoRenewalPopup: false,
              });
            });
          });
        }
      } else {
        this.setState({ error: response.error });
      }
    });

    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/WebsitePlan/true`, {}, (response) => {
      if (!response.error) {
        if (response.data) {
          const nextPayment = response.data.IsPaid === false ? new Date(response.data.StartDate) : new Date(response.data.EndDate);
          const tenDaysBeforeExpire = nextPayment.setDate(nextPayment.getDate() - 10);
          const aboutToExpire = tenDaysBeforeExpire <= new Date();
          this.setState({
            pendingPlan: response.data,
            showPendingPaymentButton: aboutToExpire && !response.data.isAutoRenewal,
          });
        } else {
          this.setState({ pendingPlan: null });
        }
      } else {
        this.setState({ error: response.error });
      }
    });
    localStorage.removeItem('TopNavigationData');
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-merchantsettings-link" key="Settings" onClick={() => this.props.history.push('/MCAdmin/PlanManagement')}>Settings</button>,
      <button data-automation-id="btn-merchantsubscription-link" key="Subscription" onClick={() => window.location.reload()}>Subscription</button>,
    ];

    return (
      <Layout data-automation-id="page-merchant-subscription" isLoading={this.state.isLoading}>
        <BreadCrumb data-automation-id="breadcrumb-merchant-subscription" breadCrumb={breadCrumb} />

        <h2>Subscription</h2>
        <Box className={styles.subscriptionBox}>
          <Row>
            <Col sm={3} xs={12} style={{ paddingTop: '25px', textAlign: 'center' }}>
              <img src={SubscribeImg} alt="Subscribe Img" width="200" />
            </Col>
            <Col sm={9} xs={12}>
              <Row className={styles.row}>
                <Col sm={3} xs={4}>
                  <lebel className={styles.header}>Plan:</lebel>
                </Col>
                <Col sm={4} xs={8} className={styles.content}>{this.state.plan}</Col>
                <Col md={4} sm={5} smOffset={0} xsOffset={4} xs={8}>
                  {!this.state.pendingPlan &&
                    <Button data-automation-id="btn-merchant-cancelsubscription" id="CancelSubscriptionBTN" className={styles.button} onClick={() => { this.setState({ showCancelSubscription: true }); }}>Cancel Subscription</Button>
                  }
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col sm={3} xs={4}>
                  <lebel className={styles.header}>Amount:</lebel>
                </Col>
                <Col sm={4} xs={8} className={styles.content}>{this.state.amount && `$${this.state.amount} AUD`}</Col>
                <Col md={4} sm={5} smOffset={0} xsOffset={4} xs={8}>
                  <Button data-automation-id="btn-merchant-viewpayment" className={styles.button} onClick={() => this.props.history.push('/MCAdmin/Subscription/PaymentHistory')}>
                    View Payment History
                  </Button>
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col sm={3} xs={4}>
                  <lebel className={styles.header}>Billing Cycle:</lebel>
                </Col>
                <Col sm={4} xs={8} className={styles.content}>{this.state.billingCycle}</Col>
              </Row>
              <Row className={styles.row}>
                <Col sm={3} xs={4}>
                  <lebel className={styles.header}>Automatic renewal:</lebel>
                </Col>
                <Col sm={4} xs={8} className={styles.content}>
                  {this.state.isAutoRenewal !== undefined && this.state.isAutoRenewal === true && 'Enable'}
                  {this.state.isAutoRenewal !== undefined && this.state.isAutoRenewal === false && 'Disable'}
                </Col>
                <Col md={4} sm={5} smOffset={0} xsOffset={4} xs={8}>
                  { this.state.showAutoRenewalButton && this.state.pendingPlan === null && this.state.isAutoRenewal !== undefined && this.state.isAutoRenewal === true &&
                    <Button
                      data-automation-id="btn-merchant-disable-autorenewal"
                      id="DisableAutoRenewalBTN" className={styles.button}
                      onClick={() => {
                        this.setState({ showDisableAutoRenewalPopup: true });
                      }}
                    >Disable Auto Renewal</Button>
                  }
                  { this.state.showAutoRenewalButton && this.state.pendingPlan === null && this.state.isAutoRenewal !== undefined && this.state.isAutoRenewal === false &&
                    <Button
                      data-automation-id="btn-merchant-enable-autorenewal"
                      id="EnableAutoRenewalBTN" className={styles.button}
                      onClick={() => {
                        this.setState({ showEnableAutoRenewalPopup: true });
                      }}
                    >Enable Auto Renewal</Button>
                  }
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col sm={3} xs={4}>
                  <lebel className={styles.header}>{!this.state.pendingPlan ? 'Next Payment:' : 'End Date:'}</lebel>
                </Col>
                <Col sm={4} xs={2}>{formatDate(this.state.nextPayment)}</Col>
                <Col md={4} sm={5} xs={8} smOffset={0} xsOffset={4}>
                  { this.state.showPaymentButton && this.state.pendingPlan === null &&
                    <Button data-automation-id="btn-merchant-makepayment" className={styles.button} onClick={() => { this.setState({ makePayment: true }); }}>Make a Payment</Button>
                  }
                </Col>
              </Row>
            </Col>
          </Row>
        </Box>
        {this.state.pendingPlan && <h2>Next Plan</h2>}
        { this.state.pendingPlan &&
          <Box>
            <Row className={styles.row}>
              <Col sm={4} xs={4}>
                <lebel className={styles.header}>Plan:</lebel>
              </Col>
              <Col sm={3} xs={8}>{this.state.pendingPlan.PlanDetail.Name}</Col>
              <Col sm={5} smOffset={0} xsOffset={4} xs={8}>
                <Button data-automation-id="btn-merchant-cancelsubscription" id="CancelSubscriptionBTN" className={styles.button} onClick={() => { this.setState({ showCancelSubscription: true }); }}>Cancel Subscription</Button>
              </Col>
            </Row>
            <Row className={styles.row}>
              <Col xs={4}>
                <lebel className={styles.header}>Amount:</lebel>
              </Col>
              <Col xs={8}>
                { this.state.pendingPlan.PaymentScheduleStatus === 'Month' ?
                  `$${this.state.pendingPlan.PlanDetail.Price} AUD` :
                  `$${this.state.pendingPlan.PlanDetail.PricePerYear} AUD`
                }
              </Col>
            </Row>
            <Row className={styles.row}>
              <Col xs={4}>
                <lebel className={styles.header}>Billing Cycle:</lebel>
              </Col>
              <Col xs={8}>{this.state.pendingPlan.PaymentScheduleStatus}</Col>
            </Row>
            <Row className={styles.row}>
              <Col sm={4} xs={4}>
                <lebel className={styles.header}>Automatic renewal:</lebel>
              </Col>
              <Col sm={3} xs={8}>
                {this.state.pendingPlan.IsAutoRenewal === true && 'Enable'}
                {this.state.pendingPlan.IsAutoRenewal === false && 'Disable'}
              </Col>
            </Row>
            <Row className={styles.row}>
              <Col xs={4}>
                <lebel className={styles.header}>Start Date:</lebel>
              </Col>
              <Col xs={8}>{formatDate(this.state.pendingPlan.StartDate)}</Col>
            </Row>
            <Row className={styles.row}>
              <Col xs={4}>
                <lebel className={styles.header}>Next Payment:</lebel>
              </Col>
              <Col xs={3}>{this.state.pendingPlan.IsPaid === false ? formatDate(this.state.pendingPlan.StartDate) : formatDate(this.state.pendingPlan.EndDate)}</Col>
              <Col xs={5}>
                { (this.state.showPendingPaymentButton && this.state.pendingPlan.IsPaid === false) &&
                  this.state.pendingPlan.IsAutoRenewal === false &&
                  <Button
                    data-automation-id="btn-merchant-makepayment"
                    onClick={() => { this.setState({ makePaymentNextPlan: true }); }}
                  >Make a Payment</Button>
                }
              </Col>
            </Row>
          </Box>
        }

        { this.state.showCancelSubscription &&
          <CancelSubscription onClose={() => this.setState({ showCancelSubscription: false })} />
        }

        { this.state.showDisableAutoRenewalPopup &&
          <DisableAutoRenewal
            data-automation-id="merchant-disableAutoRenewal"
            onClose={() => {
              // this.setState({ showDisableAutoRenewalPopup: false });
              this.updateCurrentPlan();
            }}
          />
        }

        { this.state.makePayment && this.state.plan &&
          <PaymentPopup
            data-automation-id="merchant-paymentPopup"
            onSuccess={() => {
              auth.updateWebsite(() => {
                this.setState({ makePayment: false, makePaymentSuccess: true });
                this.updateCurrentPlan();
              });
            }}
            onClose={() => { this.setState({ makePayment: false }); }}
            plan={this.state.currentPlan}
            websiteID={localStorage.getItem('websiteID')}
            isAuto={this.state.isAutoRenewal}
            billingCycle={this.state.billingCycle}
          />
        }

        { this.state.makePaymentNextPlan &&
          <PaymentPopup
            data-automation-id="merchant-paymentPopup"
            onSuccess={() => {
              auth.updateWebsite(() => {
                this.setState({ makePaymentNextPlan: false, makePaymentSuccess: true });
                this.updateCurrentPlan();
              });
            }}
            onClose={() => { this.setState({ makePaymentNextPlan: false }); }}
            plan={this.state.pendingPlan.PlanDetail}
            websiteID={localStorage.getItem('websiteID')}
            isAuto={this.state.isAutoRenewal}
            billingCycle={this.state.billingCycle}
          />
        }

        { this.state.showEnableAutoRenewalPopup &&
          <PaymentPopup
            data-automation-id="merchant-paymentPopup"
            title="Enable Auto Renewal"
            onSuccess={() => {
              auth.updateWebsite(() => {
                this.setState({ showEnableAutoRenewalPopup: false, enableAutoRenewalSuccess: true });
                this.updateCurrentPlan();
              });
            }}
            onClose={() => {
              this.setState({ showEnableAutoRenewalPopup: false });
              this.updateCurrentPlan();
            }}
            plan={this.state.currentPlan}
            websiteID={localStorage.getItem('websiteID')}
            isAuto={this.state.isAutoRenewal}
            billingCycle={this.state.billingCycle}
            isEnableAutoRenewal={Boolean(true)}
          />
        }

        { this.state.makePaymentSuccess &&
          <SuccessPopup
            data-automation-id="dialog-merchant-payment-success"
            onClose={() => {
              this.setState({ makePaymentSuccess: false });
              window.location.href = '/MCAdmin/Subscription';
            }}
          >
            <h3>You have been successful</h3>
            <div>Thanks for your payment.</div>
          </SuccessPopup>
        }

        { this.state.enableAutoRenewalSuccess &&
          <SuccessPopup
            data-automation-id="dialog-merchant-enable-autorenewal"
            onClose={() => {
              this.setState({ enableAutoRenewalSuccess: false });
              this.updateCurrentPlan();
            }}
          >
            <h3>Enable Auto Renewal</h3>
            <div>Auto renewal option is enabled.</div>
          </SuccessPopup>
        }

        { this.props.location.query.Overdue && this.state.showPaymentButton &&
          <Dialog
            data-automation-id="dialog-merchant-account-overdue"
            title="Account overdue"
            onClose={() => this.props.history.push('/MCAdmin/Subscription')}
            actions={[
              <Button
                onClick={() => {
                  this.setState({ makePayment: true });
                  this.props.history.push('/MCAdmin/Subscription');
                }}
              >Make a Payment</Button>,
            ]}
          >
            Your account is overdue. Please proceed to payment to renew your subscription.
          </Dialog>
        }

        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-merchant-subscription"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>
    );
  }
}

Subscription.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Subscription;
