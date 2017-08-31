import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import TextBox from '../../../Components/TextBox';

class GoogleMap1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, clientContent, editMode, id, setting } = this.props;

    const sectionTitle = setting.title ? (
      <div className="title-content">
        <TextBox
          id={`google-map-1-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{title}</TextBox>
      </div>
    ) : null;

    const sectionMap = (
      <div className="map-content center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12570.469962953743!2d145.343089!3d-38.032696!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x81606e90742cba57!2sCybera+Digital!5e0!3m2!1sen!2sau!4v1484701425540"
          width={`${setting.mapSize.width}%`} height={`${setting.mapSize.height}px`}
        />
      </div>
    );

    const sectionContent = setting.clientContent ? (
      <div className="client-content">
        <TextBox
          id="google-map-client-content"
          editMode={editMode}
          sectionID={id}
          type="clientContent"
        >{clientContent}</TextBox>
      </div>
    ) : null;

    return (
      <div
        className="google-map-1"
        data-automation-id="section-google-map"
        data-automation-design="google-map-1"
        data-automation-section-id={id} // eslint-disable-line
      >
        { sectionTitle }
        { sectionMap }
        { sectionContent }
      </div>
    );
  }
}

GoogleMap1.propTypes = {
  editMode: PropTypes.bool,
  id: PropTypes.number,
  title: PropTypes.string,
  clientContent: PropTypes.string,
  setting: PropTypes.object,
};

GoogleMap1.defaultProps = {
  id: null,
  editMode: false,
  title: '',
  clientContent: '',
  setting: {},
};

export default GoogleMap1;
