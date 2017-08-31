import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';

import styles from './styles.css';

import Dialog from '../Dialog';
import ImageSlide from '../Icons/ImageSlide';

import AboutUs1Initail from '../../../Websites/Section/AboutUs/AboutUs1/initail';
import AboutUs11Initail from '../../../Websites/Section/AboutUs/AboutUs11/initail';

import ImageSlider1 from './icons/ImageSlider1.jpg';
import ImageGallery1 from './icons/ImageGallery1.jpg';
import AboutUs1 from './icons/AboutUs1.jpg';
import AboutUs11 from './icons/AboutUs11.jpg';

import {
  hideSectionDesigns,
  changeSectionDesign,
} from '../../actions';

class SectionDesigns extends React.Component {
  constructor(props) {
    super(props);
    const designs = [
      { id: 1, name: 'AboutUs', design: 'AboutUs1', icon: AboutUs1, initailData: AboutUs1Initail },
      {
        id: 2,
        name: 'ImageSlider',
        design: 'ImageSlider1',
        icon: ImageSlider1,
        initailData: {
          name: 'ImageSlider',
          design: 'ImageSlider1',
          fluid: true,
          data: { items: [{ id: 1, url: '' }, { id: 2, url: '' }, { id: 3, url: '' }] },
        },
      },
      { id: 3, name: 'ImageGallery', design: 'ImageGallery1', icon: ImageGallery1 },
      { id: 4, name: 'AboutUs', design: 'AboutUs11', icon: AboutUs11, initailData: AboutUs11Initail },
    ];

    this.state = {
      sections: [
        { icon: <ImageSlide />, name: 'Image Slide' },
        { icon: <ImageSlide />, name: 'Image Gallery' },
        { icon: <ImageSlide />, name: 'About Us' },
      ],
      designs,
    };
  }

  render() {
    const { popup, onClose, onChangeSectionDesign, activeSection } = this.props;
    const filteredDesigns = activeSection ? this.state.designs.filter((x) => x.design !== activeSection.design && x.name === activeSection.name) : [];
    const designs = [];
    for (let index = 0; index < filteredDesigns.length; index += 2) {
      const design = filteredDesigns[index];
      designs.push(<Row key={`row_${design.id}`}>
        <Col xs={6}><button onClick={() => onChangeSectionDesign(activeSection.id, design.design)}><img src={design.icon} alt="" /></button></Col>
        {filteredDesigns[index + 1] && <Col xs={6}><button onClick={() => onChangeSectionDesign(activeSection.id, filteredDesigns[index + 1].design)}><img src={filteredDesigns[index + 1].icon} alt="" /></button></Col>}
      </Row>);
    }
    return (
      <Dialog
        title="Slide property"
        open={popup === 'showSectionDesigns'}
        onClose={() => onClose()}
        contentStyle={{ width: '928px' }}
      >
        <div className={styles.container}>
          <Row>
            <Col xs={12} className={styles.sections}>
              { designs }
            </Col>
          </Row>
        </div>
      </Dialog>
    );
  }
}

SectionDesigns.propTypes = {
  popup: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
  onChangeSectionDesign: PropTypes.func.isRequired,

  activeSection: PropTypes.object,
};

SectionDesigns.defaultProps = {
  activeSection: null,
};

function mapStateToProps(reducer) {
  const state = reducer.get('pageEditor');
  const activeSectionID = state.get('activeSectionID');
  return {
    popup: state.get('popup'),
    activeSection: activeSectionID ? state.get('pageData').get('Body').toJS().find((x) => x.id === activeSectionID) : null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(hideSectionDesigns()),
    onChangeSectionDesign: (sectionID, design) => dispatch(changeSectionDesign(sectionID, design)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionDesigns);
