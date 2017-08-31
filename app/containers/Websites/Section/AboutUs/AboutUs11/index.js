import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Image from '../../../Components/Image';
import TextBox from '../../../Components/TextBox';

class AboutUs11 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, image, titleA, titleB, content, setting } = this.props;

    const sectionTitleA = setting.titleA ? (
      <div
        className="col-md-12"
        style={{ backgroundColor: `${setting.style.titleA.backgroundColor}` }}
      >
        <TextBox
          id={`about-us-11-title-order-a-${id}`}
          editMode={editMode}
          type="AboutUs11titleOrderA"
          sectionID={id}
        >{ titleA }</TextBox>
      </div>
    ) : null;

    const sectionTitleB = setting.titleB ? (
      <div className="col-md-12">
        <TextBox
          id={`about-us-11-title-order-b-${id}`}
          editMode={editMode}
          type="AboutUs11titleOrderB"
          sectionID={id}
        >{ titleB }</TextBox>
      </div>
    ) : null;

    const sectionImage = setting.image ? (
      <div className="col-md-12 text-center">
        <Image
          key={`about-us-11-image-${id}`}
          editMode={editMode}
          url={image.url}
          type="AboutUsImage11"
          sectionID={id}
          id={image.id}
          link={image.link}
          width={`${image.size}px`}
          height={`${image.size}px`}
          deletable={image.url !== null}
          style={{
            display: 'inline-block',
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        />
      </div>
    ) : null;

    const sectionContent = setting.content ? (
      <div className="col-md-12">
        <TextBox
          id={`about-us-11-content-${id}`}
          editMode={editMode}
          type="AboutUs11content"
          sectionID={id}
        >{ content }</TextBox>
      </div>
    ) : null;

    return (
      <div
        className="about-us-11"
        data-automation-id="section-about-us"
        data-automation-design="about-us-11"
        data-automation-section-id={id}
      >
        <div className="row-spacial">
          { sectionTitleA }
          { sectionTitleB }
          { sectionImage }
          { sectionContent }
        </div>
      </div>
    );
  }
}

AboutUs11.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  image: PropTypes.object,
  titleA: PropTypes.string,
  titleB: PropTypes.string,
  content: PropTypes.string,
  setting: PropTypes.object,
};

AboutUs11.defaultProps = {
  editMode: false,
  image: null,
  content: '',
  titleA: '',
  titleB: '',
  setting: {},
};

export default AboutUs11;
