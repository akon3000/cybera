import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Image from '../../../Components/Image';
import TextBox from '../../../Components/TextBox';

class AboutUs1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { editMode, id, text, image } = this.props;
    return (
      <div
        className="about-us-1"
        data-automation-id="section-about-us"
        data-automation-design="about-us-1"
        data-automation-section-id={id}
      >
        <div className="row-spacial align-items-center">
          <div className="col-md-6 about-us-image">
            <Image
              key={`about-us-1-image-${id}`}
              editMode={editMode}
              url={image.url}
              type="AboutUsImage1"
              sectionID={id}
              id={image.id}
              link={image.link}
              height={`${image.height}px`}
              deletable={image.url !== null}
            />
          </div>
          <div className="col-md-6 about-us-content">
            <TextBox
              id={`about-us-1-${id}`}
              editMode={editMode}
              type="contentAboutUs1"
              sectionID={id}
            >{ text }</TextBox>
          </div>
        </div>
      </div>
    );
  }
}

AboutUs1.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  image: PropTypes.object,
  text: PropTypes.string,
};

AboutUs1.defaultProps = {
  editMode: false,
  image: null,
  text: '',
};

export default AboutUs1;
