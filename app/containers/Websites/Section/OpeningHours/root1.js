import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './rootStyles1.css';

import Image from '../../Components/Image';
import TextBox from '../../Components/TextBox';

class RootOpeningHours1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, designNumber, setting, image, openingHours } = this.props;

    const sectionImage = setting.image ? (
      <div
        className={`col-md-7 ${designNumber === '2' ? 'offset-md-5' : ''} image`}
        style={{ height: setting.style.image.height }}
      >
        <Image
          key={`opening-hours-${designNumber}-${id}`}
          editMode={editMode}
          url={image.url}
          type="OpeningImage"
          sectionID={id}
          id={id}
          width="100%"
          link={image.link}
          height={`${setting.style.image.height}px`}
          deletable={image.url !== null}
          imageStyle={{ width: '100%', height: '100%' }}
        />
      </div>
    ) : null;

    const sectionOpeningHours = setting.openingHours ? (
      <div className="opening" style={setting.style.openingHours}>
        <TextBox
          id={`opening-hours-${designNumber}-${id}`}
          editMode={editMode}
          sectionID={id}
          type="openingContent"
        >{ openingHours }</TextBox>
      </div>
    ) : null;

    return (
      <div
        className={`opening-hours-${designNumber}`}
        data-automation-id="opening-hours"
        data-automation-design={`opening-hours-${designNumber}`}
        data-automation-section-id={id}
      >
        <div className="row-spacial">
          { sectionImage }
          { sectionOpeningHours }
        </div>
      </div>
    );
  }
}

RootOpeningHours1.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  setting: PropTypes.object,
  image: PropTypes.object,
  openingHours: PropTypes.string,
  designNumber: PropTypes.string.isRequired,
};

RootOpeningHours1.defaultProps = {
  editMode: false,
  image: null,
  setting: null,
  openingHours: '',
};

export default RootOpeningHours1;
