import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import IconClose from 'react-icons/lib/md/close';

import s from './styles.css';
import PlanBox from '../PlanBox';

class TemplatePreview extends React.Component {

  getStateClass() {
    if (this.props.isClosing) {
      return s.isClosing;
    }

    return s.isOpening;
  }

  render() {
    const planBox = [];

    if (this.props.isShowPlan && !this.props.isClosingPlan) { //  && !this.props.isClosing) || this.props.isClosingPlan
      planBox.push(
        <PlanBox
          key="PlanBox"
          plans={this.props.plans}
          isClosing={this.props.isClosingPlan}
          onSelectPlan={(planID) => this.props.onSelectPlan(planID)}
          onClose={this.props.onClosePlan}
        />);
    }

    return (
      <Col data-automation-id={`template-preview-${this.props.Name.toLowerCase()}`} lg={12} className={`${s.container} ${this.getStateClass()}`}>
        <Row key={this.props.Id} className={`${s.row} ${((this.props.isShowPlan && !this.props.isClosingPlan)) && s.hide}`}>
          <Col md={7} xs={12}>
            <img data-automation-id="image-template-preview" src={this.props.PreviewUrl} alt="presentation" />
          </Col>
          <Col md={5} xs={12}>
            <h2 data-automation-id="title-template-preview">{this.props.Name}</h2>
            <div className={s.detail}>{this.props.Detail}</div>
            <button data-automation-id="btn-select" className={`selectBtn ${s.btn}`} onClick={() => this.props.onClickSelect()}>Select</button>
            <button data-automation-id="btn-preview" className={`previewBtn ${s.btn}`} onClick={this.props.showExample}>Preview</button>
            <IconClose data-automation-id="icon-close" className={`closeBtn ${s.closeButton}`} onClick={this.props.onClose} />
          </Col>
        </Row>
        { planBox }
      </Col>
    );
  }
}

TemplatePreview.propTypes = {
  Id: PropTypes.number.isRequired,
  Name: PropTypes.string.isRequired,
  PreviewUrl: PropTypes.string.isRequired,
  Detail: PropTypes.string.isRequired,
  showExample: PropTypes.func.isRequired,
  isClosing: PropTypes.bool.isRequired,
  isShowPlan: PropTypes.bool.isRequired,
  onClickSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isClosingPlan: PropTypes.bool.isRequired,
  onSelectPlan: PropTypes.func.isRequired,
  onClosePlan: PropTypes.func.isRequired,
  plans: PropTypes.array.isRequired,
};

export default TemplatePreview;
