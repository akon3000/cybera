import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-flexbox-grid';

import s from './styles.css';

function TemplateBox(props) {
  return (
    <Col
      key={props.Id}
      lg={3}
      md={4}
      sm={6}
      xs={12}
      onClick={props.onClick}
      data-automation-id={`template-box-${props.Name.toLowerCase()}`}
      className={`${s.container} ${props.className}`}
    >
      <button id={`templateBox_${props.Id}`} className={s.templateBox} data-automation-id="btn-template-box">
        <h4 data-automation-id="title-template-box">{props.Name}</h4>
        <img src={props.ThumbImageUrl} alt="presentation" data-automation-id="image-template-box" />
      </button>
    </Col>
  );
}

TemplateBox.propTypes = {
  Id: PropTypes.number.isRequired,
  ThumbImageUrl: PropTypes.string.isRequired,
  Name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

TemplateBox.defaultProps = {
  className: null,
};

export default TemplateBox;
