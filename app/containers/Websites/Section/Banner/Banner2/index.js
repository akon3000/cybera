import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Image from '../../../Components/Image';

class Banner2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, bannerItems, editMode, setting } = this.props;
    const bannerOne = bannerItems[0];
    const bannerTwo = bannerItems[1];
    const bannerThree = bannerItems[2];
    return (
      <div
        className={`banner-2 ${!setting.leftRightPadding && 'hidden-space-left-right'}`}
        data-automation-id="section-banner"
        data-automation-design="banner-2"
        data-automation-section-id={id}
      >
        <div className="row-spacial">

          <div className={`col-md-12 col-sm-12 ${setting.spaceBetween ? 'padding-left padding-right' : 'padding-none'}`}>
            <div className={`${setting.spaceBetween ? 'padding-left padding-right padding-top' : ''}`}>
              <Image
                key={`banner-2-${id}-${bannerOne.id}`}
                editMode={editMode}
                url={bannerOne.url}
                type="BannerGrid"
                sectionID={id}
                id={bannerOne.id}
                width="auto"
                link={bannerOne.link}
                height={`${setting.imageSize.height}px`}
                deletable={bannerOne.url !== null}
                style={{ overflow: 'hidden' }}
                imageStyle={{ width: '100%', maxHeight: 'none' }}
              />
            </div>
          </div>

          <div className={`col-md-4 col-sm-12 ${setting.spaceBetween ? 'padding-left padding-right' : 'padding-none'}`}>
            <div className={`${setting.spaceBetween ? 'padding-left padding-top padding-bottom bannerTwoSpace' : ''}`}>
              <Image
                key={`banner-2-${id}-${bannerTwo.id}`}
                editMode={editMode}
                url={bannerTwo.url}
                type="BannerGrid"
                sectionID={id}
                id={bannerTwo.id}
                width="auto"
                link={bannerTwo.link}
                height={`${setting.imageSize.height}px`}
                deletable={bannerTwo.url !== null}
                style={{ overflow: 'hidden' }}
                imageStyle={{ width: '100%', maxHeight: 'none' }}
              />
            </div>
          </div>

          <div className={`col-md-8 col-sm-12 ${setting.spaceBetween ? 'padding-left padding-right' : 'padding-none'}`}>
            <div className={`${setting.spaceBetween ? 'padding-right padding-top padding-bottom bannerThreeSpace' : ''}`}>
              <Image
                key={`banner-2-${id}-${bannerThree.id}`}
                editMode={editMode}
                url={bannerThree.url}
                type="BannerGrid"
                sectionID={id}
                id={bannerThree.id}
                width="auto"
                link={bannerThree.link}
                height={`${setting.imageSize.height}px`}
                deletable={bannerThree.url !== null}
                style={{ overflow: 'hidden' }}
                imageStyle={{ width: '100%', maxHeight: 'none' }}
              />
            </div>
          </div>

        </div>

      </div>
    );
  }
}

Banner2.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  bannerItems: PropTypes.array,
  setting: PropTypes.object,
};

Banner2.defaultProps = {
  editMode: false,
  bannerItems: [],
  setting: {},
};

export default Banner2;
