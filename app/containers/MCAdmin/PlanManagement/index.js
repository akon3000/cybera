import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';

import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import Button from '../../../components/Button';
import styles from './styles.css';

import request from '../../../utils/request';
import { apiUrl, plans } from '../../../config';
import { formatDate } from '../../../utils';
import auth from '../../../utils/auth';

import Plans from './Plans';
import PaymentPopup from '../../../components/PaymentPopup';
import ErrorPopup from '../../../components/ErrorPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import ConfirmPopup from '../../../components/ConfirmPopup';
import Loading from '../../../components/Loading';
import PlanImg from './plan.png';

class PlanManagement extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showPlans: false,
      websiteID: localStorage.getItem('websiteID'),
      website: JSON.parse(localStorage.getItem('website')),
      pendingPlan: false,
    };
  }

  componentDidMount() {
    this.updateCurrentPlan();
  }

  getPlans() {
    this.setState({
      plans,
      currentPlan: plans.filter((value) => value.Id === this.state.currentPlanID)[0],
    });
  }

  downGradePlan() {
    if (this.state.website.PaymentStatus === 'Overdue') {
      this.setState({ showDowngradePayment: true });
    } else {
      const datas = {
        IsAuto: this.state.isAutoRenewal,
        IsBillingCyclePerMonth: this.state.billingCycle === 'Month',
        PlanId: this.state.selectedPlan.Id,
      };

      this.setState({ loadingDowngrade: true });

      request.put(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/PurchasePlan`,
        datas,
        (response) => {
          if (!response.error) {
            this.setState({
              success: 'Your plan have been changed.',
              selectedPlan: false,
              loadingDowngrade: false,
            });
          } else {
            this.setState({
              error: response.error,
              loadingDowngrade: false,
            });
          }
          this.updateCurrentPlan();
        }
      );
    }
  }

  updateCurrentPlan() {
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/WebsitePlan/false`, {}, (response) => {
      if (!response.error) {
        if (response.data) {
          this.setState({
            currentPlanID: response.data.PlanDetail.Id,
            isAutoRenewal: response.data.IsAutoRenewal,
            billingCycle: response.data.PaymentScheduleStatus,
            endDate: response.data.EndDate,
            isLoading: false,
          }, () => {
            auth.updateWebsite(() => {
              this.getPlans();
            });
          });
        }
      } else {
        this.setState({ isLoading: false, error: response.error });
      }
    });

    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/WebsitePlan/true`, {}, (response) => {
      if (!response.error) {
        if (response.data) {
          this.setState({ pendingPlan: response.data });
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
    return (
      <Layout data-automation-id="page-planmanagement" isLoading={this.state.isLoading}>
        <BreadCrumb
          data-automation-id="breadcrumb-planmanagement"
          breadCrumb={[
            <button data-automation-id="btn-merchantsettings-link" key="Settings" onClick={() => window.location.reload()}>Settings</button>,
            <button data-automation-id="btn-planmanagement-link" key="Plan" onClick={() => window.location.reload()}>Plan</button>,
          ]}
        />
        <h2>Plan</h2>
        <Box>
          <Row>
            <Col sm={4} xs={12} style={{ paddingTop: '25px', textAlign: 'center' }}>
              <img src={PlanImg} alt="Plan Img" width="200" />
            </Col>
            <Col sm={8} xs={12}>
              <Row className={styles.row}>
                <Col sm={3} xs={4}>
                  <lebel className={styles.header}>Plan:</lebel>
                </Col>
                <Col sm={5} xs={8} className={styles.content}>{this.state.currentPlan && this.state.currentPlan.Name}</Col>
                <Col sm={4} smOffset={0} xsOffset={4} xs={8}>
                  { this.state.pendingPlan === null &&
                    <Button
                      data-automation-id="btn-changeplan"
                      id="ChangePlanBTN"
                      className={styles.button}
                      onClick={() => {
                        this.setState({ showPlans: true });
                      }}
                    >Change Your Plan</Button>
                  }
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col sm={3} xs={4}>
                  <lebel className={styles.header}>Available Features:</lebel>
                </Col>
                {this.state.currentPlan &&
                  <Col sm={9} xs={8}>
                    <ul data-automation-id="list-currentplan" className={styles.content}>
                      <li>- Fully responsive</li>
                      <li>- Admin dashboard</li>
                      <li>- HD images/video</li>
                      <li>- {this.state.currentPlan.storage !== 'Unlimited' ? `${this.state.currentPlan.storage} GB` : this.state.currentPlan.storage} storage</li>
                      <li>- Google Analytics</li>
                      <li>- {this.state.currentPlan.products} products</li>
                      <li>- Integrations</li>
                      {this.state.currentPlan.Id === 4 && <li>- Free premium template</li>}
                    </ul>
                  </Col>
                }
              </Row>
              {this.state.pendingPlan &&
                <Row className={styles.row}>
                  <Col sm={3} xs={4}>
                    <lebel className={styles.header}>End Date:</lebel>
                  </Col>
                  <Col sm={9} xs={8}>{formatDate(this.state.endDate)}</Col>
                </Row>
              }
            </Col>
          </Row>
        </Box>

        { this.state.pendingPlan && <h2>Next Plan</h2> }

        { this.state.pendingPlan &&
          <Box data-automation-id="box-pendingplan">
            <Row className={styles.row}>
              <Col sm={4} xs={4}>
                <lebel className={styles.header}>Plan:</lebel>
              </Col>
              <Col sm={3} xs={8}>{this.state.pendingPlan.PlanDetail.Name}</Col>
            </Row>
            <Row className={styles.row}>
              <Col xs={4}>
                <lebel className={styles.header}>Available Features:</lebel>
              </Col>
              <Col xs={8}>
                <ul>
                  <li>- Fully responsive</li>
                  <li>- Admin dashboard</li>
                  <li>- HD images/video</li>
                  <li>- {this.state.pendingPlan.PlanDetail.StorageSize !== 'Unlimited' ? `${this.state.pendingPlan.PlanDetail.StorageSize} GB` : this.state.currentPlan.storage} storage</li>
                  <li>- Google Analytics</li>
                  <li>- {this.state.pendingPlan.PlanDetail.LimitProduct} products</li>
                  <li>- Integrations</li>
                  {this.state.pendingPlan.Id === 4 && <li>- Free premium template</li>}
                </ul>
              </Col>
            </Row>
            <Row className={styles.row}>
              <Col xs={4}>
                <lebel className={styles.header}>Start Date:</lebel>
              </Col>
              <Col xs={8}>{formatDate(this.state.pendingPlan.StartDate)}</Col>
            </Row>
          </Box>
        }

        { this.state.showPlans &&
          <Plans
            data-automation-id="plans"
            onClose={() => { this.setState({ showPlans: false }); }}
            onSelectPlan={(plan) => { this.setState({ selectedPlan: plan, showPlans: false }); }}
            plans={this.state.plans}
            currentPlanID={this.state.currentPlan.Id}
          />
        }

        { this.state.selectedPlan && !this.state.isLoading && this.state.selectedPlan.Price < this.state.currentPlan.Price && !this.state.showDowngradePayment &&
          <ConfirmPopup
            data-automation-id="dialog-downgradeplan"
            onClose={() => this.setState({ selectedPlan: false })}
            actions={[
              <Button onClick={() => this.downGradePlan()}>Confirm</Button>,
              <Button btnStyle="negative" onClick={() => this.setState({ selectedPlan: false })}>cancel</Button>,
            ]}
          >
            <h3>Confirmation</h3>
            <div>Are you sure you want to downgrade your plan?</div>
            { this.state.loadingDowngrade && <Loading /> }
          </ConfirmPopup>
        }

        { this.state.success &&
          <SuccessPopup
            data-automation-id="dialog-plan-success"
            onClose={() => this.setState({ success: false })}
          >
            <h3>You have been successful</h3>
            <div>{this.state.success}</div>
          </SuccessPopup>
        }

        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-plan-fail"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }

        { this.state.selectedPlan && (this.state.selectedPlan.Price > this.state.currentPlan.Price || this.state.showDowngradePayment) &&
          <PaymentPopup
            data-automation-id="paymentpopup-planmanagement"
            key="PaymentPopup"
            plan={this.state.selectedPlan}
            isChangePlan={Boolean(true)}
            billingCycle={this.state.billingCycle}
            isAuto={this.state.isAutoRenewal}
            websiteID={localStorage.getItem('websiteID')}
            onClose={() => {
              this.setState({ selectedPlan: false });
            }}
            onSuccess={() => {
              this.updateCurrentPlan();
              this.setState({
                showEmailVerify: true,
                selectedPlan: false,
                success: 'Your plan have been changed.',
              });
            }}
          />
        }

      </Layout>);
  }
}

export default PlanManagement;
