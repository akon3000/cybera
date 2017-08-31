import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import IconClose from 'react-icons/lib/md/close';

import s from './styles.css';
import { plans } from '../../../../config';
import SlideBox from '../../../../components/SlideBox';

function PlanBox(props) {
  const onSelectPlan = props.onSelectPlan;

  const backgroundColor = ['#758592', '#628EB5', '#8E8F87', '#8F9D9E'];
  return (
    <div data-automation-id="popup-plan-box" className={`${s.row} ${props.isClosing ? s.isClosing : s.isOpening}`}>
      <IconClose data-automation-id="icon-close" className={`closeBtn ${s.closeButton}`} onClick={props.onClose} />
      <Row className={s.notMobile} data-automation-id="container-default">
        {
          plans.map((plan) => {
            const automateName = plan.Name.replace(' ', '-').toLowerCase();
            return (
              <Col data-automation-id={`option-plan-${automateName}`} id={`plan_${plan.Id}`} key={`plan_${plan.Id}`} md={3} sm={6} xs={12}>
                <div className={s.planBox}>
                  <div className={s.priceBox}>
                    <div style={{ fontSize: '15pt' }}><b>{plan.Name}</b></div>
                    <span className={s.perMonthPrice}>${plan.Price}</span>
                    <span className={s.perMonth}>per month</span>
                    <span className={s.perYear}>${plan.PricePerYear} per year</span>
                  </div>
                  <ul>
                    <li>Fully responsive</li>
                    <li>Admin dashboard</li>
                    <li>HD images/video</li>
                    <li>{plan.storage !== 'Unlimited' ? `${plan.storage} GB` : plan.storage} storage</li>
                    <li>Google Analytics</li>
                    {plan.isEcommerce && <li>{plan.products} products</li>}
                    <li>Integrations <span className={s.red}>*</span></li>
                    {plan.Id === 2 && <li className={s.freeTrial}>Free 30 days’ trial</li>}
                    {plan.isFreePremiumTemplate && <li>Free premium template</li>}
                    {!plan.isEcommerce && <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                    {(plan.Id !== 2 && plan.Id !== 4) && <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                  </ul>
                  <div className={s.buttonContainer}>
                    <button data-automation-id="btn-select-plan" className="selectPlan" onClick={() => onSelectPlan(plan.Id)}>Select Plan</button>
                  </div>
                </div>
              </Col>
            );
          })
        }
      </Row>
      <Row className={s.mobile} data-automation-id="container-mobile">
        <SlideBox data-automation-id="slide-mobile">
          {
            plans.map((plan, index) => {
              const automateName = plan.Name.replace(' ', '-').toLowerCase();
              return (
                <Col data-automation-id={`option-plan-${automateName}`} id={`plan_${plan.Id}`} key={`plan_${plan.Id}`} md={3} sm={6} xs={12}>
                  <div className={s.planBox}>
                    <div className={s.priceBox} style={{ backgroundColor: backgroundColor[index] }}>
                      <div style={{ fontSize: '15pt' }}><b>{plan.Name}</b></div>
                      <span className={s.perMonthPrice}>${plan.Price}</span>
                      <span className={s.perMonth}>per month</span>
                      <span className={s.perYear}>${plan.PricePerYear} per year</span>
                    </div>
                    <ul>
                      <li>Fully responsive</li>
                      <li>Admin dashboard</li>
                      <li>HD images/video</li>
                      <li>{plan.storage !== 'Unlimited' ? `${plan.storage} GB` : plan.storage} storage</li>
                      <li>Google Analytics</li>
                      {plan.isEcommerce && <li>{plan.products} products</li>}
                      <li>Integrations <span className={s.red}>*</span></li>
                      {plan.Id === 2 && <li className={s.freeTrial}>Free 30 days’ trial</li>}
                      {plan.isFreePremiumTemplate && <li>Free premium template</li>}
                      {!plan.isFreePremiumTemplate && <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                      {!plan.isEcommerce && <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                      {plan.Id !== 2 && <li style={{ borderBottom: 'none' }}>&nbsp;</li>}
                    </ul>
                    <div className={s.buttonContainer}>
                      <button data-automation-id="btn-select-plan" className="selectPlan" onClick={() => onSelectPlan(plan.Id)}>Select Plan</button>
                    </div>
                  </div>
                </Col>
              );
            })
          }
        </SlideBox>
      </Row>
    </div>
  );
}

PlanBox.propTypes = {
  isClosing: PropTypes.bool.isRequired,
  onSelectPlan: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PlanBox;
