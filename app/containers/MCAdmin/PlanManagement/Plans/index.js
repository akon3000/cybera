import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import Dialog from '../../../../components/Dialog';
import Button from '../../../../components/Button';
import styles from './styles.css';
import { plans } from '../../../../config';
import SlideBox from '../../../../components/SlideBox';

class Plans extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    const width = window.innerWidth;
    let slidePerPage = 1;
    if (width <= 1024 && width > 800) {
      slidePerPage = 3;
    } else if (width <= 800 && width > 500) {
      slidePerPage = 2;
    }

    this.setState({ slidePerPage });
  }

  render() {
    const backgroundColor = ['#758592', '#628EB5', '#8E8F87', '#8F9D9E'];

    return (
      <Dialog
        data-automation-id="dialog-changeplan"
        title="change your plan"
        onClose={() => this.props.onClose()}
        contentStyle={{ width: '95%', maxWidth: '1100px' }}
        bodyStyle={{ minHeight: '500px', maxHeight: 'none' }}
      >
        <Row className={`${styles.row} ${styles.notMobile}`}>
          {plans.map((plan) =>
            <Col id={`plan_${plan.Id}`} key={`plan_${plan.Id}`} md={3} sm={6} xs={12}>
              <div className={styles.planBox}>
                <div className={styles.priceBox}>
                  <div style={{ fontSize: '15px' }}><b>{plan.Name}</b></div>
                  <br />
                  <span className={styles.perMonthPrice}>${Math.round(plan.Price)}</span>
                  <span className={styles.perMonth}>per month</span>
                  <span className={styles.perYear}>${Math.round(plan.PricePerYear)} per year</span>
                </div>
                <ul>
                  <li>Fully responsive</li>
                  <li>Admin dashboard</li>
                  <li>HD images/video</li>
                  <li>{plan.storage !== 'Unlimited' ? `${plan.storage} GB` : plan.storage} storage</li>
                  <li>Google Analytics</li>
                  {plan.isEcommerce ? <li>{plan.products} products</li> : ''}
                  <li>Integrations <span className={styles.red}>*</span></li>
                  {plan.Id === 2 && <li className={styles.freeTrial}>Free 30 days’ trial</li>}
                  {plan.isFreePremiumTemplate && <li>Free premium template</li>}
                  {plan.isEcommerce ? '' : <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                  {plan.Id !== 2 && plan.Id !== 4 && <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                </ul>
                <div className={styles.buttonContainer}>
                  { this.props.currentPlanID !== plan.Id &&
                    <Button
                      data-automation-id="btn-selectplan-laptop"
                      onClick={() => this.props.onSelectPlan(plan)}
                    >Select Plan</Button>}
                  {this.props.currentPlanID === plan.Id && <span style={{ height: '58px', display: 'block' }}>&nbsp;</span>}
                </div>
              </div>
            </Col>)}
        </Row>
        <Row className={`${styles.row} ${styles.mobile}`}>
          <SlideBox
            data-automation-id="slidebox-changeplan"
            className={styles.slideBox}
            itemPerPage={this.state.slidePerPage}
          >
            {plans.map((plan, index) =>
              <Col id={`plan_${plan.Id}`} key={`plan_${plan.Id}`}>
                <div className={styles.planBox}>
                  <div className={styles.priceBox} style={{ backgroundColor: backgroundColor[index] }}>
                    <div style={{ fontSize: '15px' }}><b>{plan.Name}</b></div>
                    <br style={{ display: 'block' }} />
                    <span className={styles.perMonthPrice}>${Math.round(plan.Price)}</span>
                    <span className={styles.perMonth}>per month</span>
                    <span className={styles.perYear}>${Math.round(plan.PricePerYear)} per year</span>
                  </div>
                  <ul>
                    <li>Fully responsive</li>
                    <li>Admin dashboard</li>
                    <li>HD images/video</li>
                    <li>{plan.storage !== 'Unlimited' ? `${plan.storage} GB` : plan.storage} storage</li>
                    <li>Google Analytics</li>
                    {plan.isEcommerce ? <li>{plan.products} products</li> : ''}
                    <li>Integrations <span className={styles.red}>*</span></li>
                    {plan.Id === 2 && <li className={styles.freeTrial}>Free 30 days’ trial</li>}
                    {plan.isFreePremiumTemplate && <li>Free premium template</li>}
                    {plan.isEcommerce ? '' : <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                    {plan.Id !== 2 && plan.Id !== 4 && <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                  </ul>
                  <div className={styles.buttonContainer}>
                    {this.props.currentPlanID !== plan.Id &&
                      <Button
                        data-automation-id="btn-selectplan-mobile"
                        onClick={() => this.props.onSelectPlan(plan)}
                      >Select Plan</Button>}
                    {this.props.currentPlanID === plan.Id && <span style={{ height: '55px', display: 'block' }}>&nbsp;</span>}
                  </div>
                </div>
              </Col>
            )}
          </SlideBox>
        </Row>
      </Dialog>);
  }
}

Plans.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelectPlan: PropTypes.func.isRequired,
  currentPlanID: PropTypes.number.isRequired,
};

export default Plans;
