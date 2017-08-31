import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';
import faceBook1Icon from '../facebook-1.svg';
import twitter1Icon from '../twitter-1.svg';
import googlePlus1Icon from '../google-plus-1.svg';
import instagram1Icon from '../instagram-1.svg';

import TextBox from '../../../Components/TextBox';
import Image from '../../../Components/Image';

class SocialMediaLink1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, topImage, topImageLink, title, socialList, setting } = this.props;

    const sectionTopImage = setting.topImage.show ? (
      <div className="top-image">
        <Image
          key={`social-media-link-1-${id}`}
          editMode={editMode}
          url={topImage}
          type="topImageBG"
          id={id}
          sectionID={id}
          width="auto"
          link={topImageLink}
          height={`${setting.topImage.height}px`}
          deletable={false}
        />
      </div>
    ) : null;

    const sectionTitle = setting.title ? (
      <div className="title-content">
        <TextBox
          id={`social-media-link-1-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{title}</TextBox>
      </div>
    ) : null;

    const sectionSocialList = (
      <div className="social-list-content">
        {
          socialList.map((x) => (
            <a key={`icon-social-${x.id}`} href={x.url} target="_blank">
              { x.id === 1 &&
                <img src={faceBook1Icon} width={setting.iconSize} height={setting.iconSize} alt="facebook-social" />
              }
              { x.id === 2 &&
                <img src={twitter1Icon} width={setting.iconSize} height={setting.iconSize} alt="facebook-social" />
              }
              { x.id === 3 &&
                <img src={googlePlus1Icon} width={setting.iconSize} height={setting.iconSize} alt="facebook-social" />
              }
              { x.id === 4 &&
                <img src={instagram1Icon} width={setting.iconSize} height={setting.iconSize} alt="facebook-social" />
              }
            </a>
          ))
        }
      </div>
    );

    return (
      <div
        className="social-media-link-1"
        data-automation-id="section-social-media-link"
        data-automation-design="social-media-link-1"
        data-automation-section-id={id}
      >
        { sectionTopImage }
        { sectionTitle }
        { sectionSocialList }
      </div>
    );
  }
}

SocialMediaLink1.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  socialList: PropTypes.array,
  editMode: PropTypes.bool,
  topImage: PropTypes.string,
  topImageLink: PropTypes.object,
  setting: PropTypes.object,
};

SocialMediaLink1.defaultProps = {
  title: '',
  socialList: [],
  editMode: false,
  topImage: '',
  topImageLink: null,
  setting: {},
};

export default SocialMediaLink1;
