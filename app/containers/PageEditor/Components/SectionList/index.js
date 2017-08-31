import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';

import styles from './styles.css';

import Dialog from '../Dialog';
import ImageSlide from '../Icons/ImageSlide';

/* --- Icon Section --- */
import AboutUs1 from './icons/AboutUs1.jpg';
import AboutUs11 from './icons/AboutUs11.jpg';

import ImageSlider1 from './icons/ImageSlider1.jpg';

import ImageGallery1 from './icons/ImageGallery1.jpg';

import SocialMediaLink1 from './icons/SocialMediaLink1.jpg';

import Clients1 from './icons/Clients1.jpg';

import GoogleMap1 from './icons/GoogleMap1.jpg';

import Banner2 from './icons/Banner2.jpg';

import Faq1 from './icons/FAQ1.jpg';

import HorizontalTab1 from './icons/HorizontalTab1.jpg';

import MeetTheTeam5 from './icons/MeetTheTeam5.jpg';

import VerticalTab1 from './icons/VerticalTab1.jpg';

import Calendar2 from './icons/Calendar2.jpg';

import SplitContent3 from './icons/SplitContent3.jpg';
import SplitContent6 from './icons/SplitContent6.jpg';
import SplitContent8 from './icons/SplitContent8.jpg';

import OpeningHours2 from './icons/OpeningHours2.jpg';
import OpeningHours8 from './icons/OpeningHours8.jpg';

import Project1 from './icons/Project1.jpg';
import Project3 from './icons/Project3.jpg';

import Service1 from './icons/Service1.jpg';

import Testimonials1 from './icons/Testimonials1.jpg';

import BlogList3 from './icons/BlogList3.jpg';

import Subscribe1 from './icons/Subscribe1.jpg';

/* --- Icon Section --- */

/* --- Initial Data --- */
import AboutUs1Initail from '../../../Websites/Section/AboutUs/AboutUs1/initail';
import AboutUs11Initail from '../../../Websites/Section/AboutUs/AboutUs11/initail';

import ImageSlider1Initail from '../../../Websites/Section/ImageSlider/ImageSlider1/initail';

import ImageGallery1Initail from '../../../Websites/Section/ImageGallery/ImageGallery1/initail';

import Clients1Initail from '../../../Websites/Section/Clients/Clients1/initail';

import SocialMediaLink1Initail from '../../../Websites/Section/SocialMediaLink/SocialMediaLink1/initail';

import GoogleMap1Initail from '../../../Websites/Section/GoogleMap/GoogleMap1/initail';

import Banner2Initail from '../../../Websites/Section/Banner/Banner2/initail';

import Faq1Initail from '../../../Websites/Section/FAQ/FAQ1/initail';

import HorizontalTab1Initail from '../../../Websites/Section/HorizontalTab/HorizontalTab1/initail';

import MeetTheTeam5Initail from '../../../Websites/Section/MeetTheTeam/MeetTheTeam5/initail';

import VerticalTab1Initail from '../../../Websites/Section/VerticalTab/VerticalTab1/initail';

import Calendar2Initail from '../../../Websites/Section/Calendar/Calendar2/initail';

import SplitContent3Initail from '../../../Websites/Section/SplitContent/SplitContent3/initail';
import SplitContent6Initail from '../../../Websites/Section/SplitContent/SplitContent6/initail';
import SplitContent8Initail from '../../../Websites/Section/SplitContent/SplitContent8/initail';

import OpeningHours2Initail from '../../../Websites/Section/OpeningHours/OpeningHours2/initail';
import OpeningHours8Initail from '../../../Websites/Section/OpeningHours/OpeningHours8/initail';

import Project1Initail from '../../../Websites/Section/Project/Project1/initail';
import Project3Initail from '../../../Websites/Section/Project/Project3/initail';

import Service1Initail from '../../../Websites/Section/Service/Service1/initail';

import Testimonials1Initail from '../../../Websites/Section/Testimonials/Testimonials1/initail';

import BlogList3Initail from '../../../Websites/Section/BlogList/BlogList3/initail';

import Subscribe1Initail from '../../../Websites/Section/Subscribe/Subscribe1/initail';
/* --- Initial Data --- */

import { hideSectionList, addSection } from '../../actions';

class SectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 430,
      activeSectionName: '',
      sections: [
        { icon: <ImageSlide />, name: 'About Us', label: 'AboutUs' },
        { icon: <ImageSlide />, name: 'Banner', label: 'Banner' },
        { icon: <ImageSlide />, name: 'BlogList', label: 'BlogList' },
        { icon: <ImageSlide />, name: 'Calendar', label: 'Calendar' },
        { icon: <ImageSlide />, name: 'Clients', label: 'Clients' },
        { icon: <ImageSlide />, name: 'FAQ', label: 'FAQ' },
        { icon: <ImageSlide />, name: 'GoogleMap', label: 'GoogleMap' },
        { icon: <ImageSlide />, name: 'Horizontal Tab', label: 'HorizontalTab' },
        { icon: <ImageSlide />, name: 'Image Slider', label: 'ImageSlider' },
        { icon: <ImageSlide />, name: 'Image Gallery', label: 'ImageGallery' },
        { icon: <ImageSlide />, name: 'Meet The Team', label: 'MeetTheTeam' },
        { icon: <ImageSlide />, name: 'Opening Hours', label: 'OpeningHours' },
        { icon: <ImageSlide />, name: 'Project', label: 'Project' },
        { icon: <ImageSlide />, name: 'Service', label: 'Service' },
        { icon: <ImageSlide />, name: 'Social Media Link', label: 'SocialMediaLink' },
        { icon: <ImageSlide />, name: 'Split Content', label: 'SplitContent' },
        { icon: <ImageSlide />, name: 'Subscribe', label: 'Subscribe' },
        { icon: <ImageSlide />, name: 'Testimonials', label: 'Testimonials' },
        { icon: <ImageSlide />, name: 'Vertical Tab', label: 'VerticalTab' },
      ],
      designs: [
        { name: 'AboutUs', design: 'AboutUs1', icon: AboutUs1, initailData: AboutUs1Initail },
        { name: 'ImageSlider', design: 'ImageSlider1', icon: ImageSlider1, initailData: ImageSlider1Initail },
        { name: 'ImageGallery', design: 'ImageGallery1', icon: ImageGallery1, initailData: ImageGallery1Initail },
        { name: 'AboutUs', design: 'AboutUs11', icon: AboutUs11, initailData: AboutUs11Initail },
        { name: 'Clients', design: 'Clients1', icon: Clients1, initailData: Clients1Initail },
        { name: 'SocialMediaLink', design: 'SocialMediaLink1', icon: SocialMediaLink1, initailData: SocialMediaLink1Initail },
        { name: 'GoogleMap', design: 'GoogleMap1', icon: GoogleMap1, initailData: GoogleMap1Initail },
        { name: 'Banner', design: 'Banner2', icon: Banner2, initailData: Banner2Initail },
        { name: 'FAQ', design: 'FAQ1', icon: Faq1, initailData: Faq1Initail },
        { name: 'HorizontalTab', design: 'HorizontalTab1', icon: HorizontalTab1, initailData: HorizontalTab1Initail },
        { name: 'MeetTheTeam', design: 'MeetTheTeam5', icon: MeetTheTeam5, initailData: MeetTheTeam5Initail },
        { name: 'VerticalTab', design: 'VerticalTab1', icon: VerticalTab1, initailData: VerticalTab1Initail },
        { name: 'Calendar', design: 'Calendar2', icon: Calendar2, initailData: Calendar2Initail },
        { name: 'SplitContent', design: 'SplitContent8', icon: SplitContent8, initailData: SplitContent8Initail },
        { name: 'SplitContent', design: 'SplitContent3', icon: SplitContent3, initailData: SplitContent3Initail },
        { name: 'SplitContent', design: 'SplitContent6', icon: SplitContent6, initailData: SplitContent6Initail },
        { name: 'OpeningHours', design: 'OpeningHours2', icon: OpeningHours2, initailData: OpeningHours2Initail },
        { name: 'OpeningHours', design: 'OpeningHours8', icon: OpeningHours8, initailData: OpeningHours8Initail },
        { name: 'Project', design: 'Project1', icon: Project1, initailData: Project1Initail },
        { name: 'Project', design: 'Project3', icon: Project3, initailData: Project3Initail },
        { name: 'Service', design: 'Service1', icon: Service1, initailData: Service1Initail },
        { name: 'Testimonials', design: 'Testimonials1', icon: Testimonials1, initailData: Testimonials1Initail },
        { name: 'BlogList', design: 'BlogList3', icon: BlogList3, initailData: BlogList3Initail },
        { name: 'Subscribe', design: 'Subscribe1', icon: Subscribe1, initailData: Subscribe1Initail },
      ],
    };
  }

  prepareHeight() {
    setTimeout(() => {
      const BodyDialogHTMLeditor = document.getElementsByClassName('BodyDialogHTMLeditor');
      if (BodyDialogHTMLeditor.length > 0) {
        const maxHeight = BodyDialogHTMLeditor[0].style.maxHeight;
        const prepare = parseInt(maxHeight, 10) - 30;
        if (prepare !== this.state.height) {
          this.setState({ height: prepare });
        }
      }
    });
  }

  render() {
    const { popup, onClose, onAddSection } = this.props;
    let designs = this.state.designs;

    if (this.state.activeSectionName !== '') {
      designs = designs.filter((d) => d.name === this.state.activeSectionName);
    }

    return (
      <Dialog
        title="Slide property"
        open={popup === 'showSectionList'}
        onClose={() => onClose()}
        contentStyle={{ width: '928px' }}
        bodyCustom={`${styles.bodyCustom} BodyDialogHTMLeditor`}
        handle={() => this.prepareHeight()}
      >
        <div className={styles.container}>
          <Row>
            {
              <Col xs={3} className={styles.sectionList} style={{ height: this.state.height }}>
                <button onClick={() => this.setState({ activeSectionName: '' })}><ImageSlide /> All</button>
                {this.state.sections.map((section) =>
                  <button
                    key={section.name}
                    onClick={() => this.setState({ activeSectionName: section.label })}
                  >{section.icon} <span>{section.name}</span></button>
                )}
              </Col>
            }
            <Col xs={9} className={styles.sections} style={{ height: this.state.height }}>
              <div>
                { designs.map((design) =>
                  <button
                    key={design.design}
                    onClick={() => {
                      if (design.initailData) {
                        onAddSection(design.initailData);
                      } else {
                        alert('Section not available');
                      }
                    }}
                  >
                    <img src={design.icon} alt="" />
                  </button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    );
  }
}

SectionList.propTypes = {
  popup: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
  onAddSection: PropTypes.func.isRequired,
};

SectionList.defaultProps = {};

function mapStateToProps(reducer) {
  const state = reducer.get('pageEditor');
  return {
    popup: state.get('popup'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(hideSectionList()),
    onAddSection: (section) => dispatch(addSection(section)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionList);
