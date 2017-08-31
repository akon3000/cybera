import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './styles.css';
import request from '../../utils/request';
import { apiUrl } from '../../config';
import LoadingPage from '../../components/LoadingPage';

import {
  pageDataLoaded,
  showSectionList,
} from './actions';

import Template from '../Websites/Template';
import SectionLoaders from '../Websites/Section/loaders';

import TopBar from './Components/TopBar';
import SectionTools from './Components/SectionTools';
import SectionGrid from './Components/SectionGrid';
import Mask from './Components/Mask';
import SectionList from './Components/SectionList';
import HyperLink from './Components/HyperLink';
import FileManager from './Components/FileManager';
import SectionDesigns from './Components/SectionDesigns';

/* setting popup */
import SettingAboutUs1 from './Components/SectionTools/SettingPopup/AboutUs/design1';
import SettingAboutUs11 from './Components/SectionTools/SettingPopup/AboutUs/design11';

import SettingBanner1 from './Components/SectionTools/SettingPopup/Banner/setting';

import SettingCalendar2 from './Components/SectionTools/SettingPopup/Calendar/design2';

import SettingFAQ1 from './Components/SectionTools/SettingPopup/FAQ/setting';

import SettingGoogleMap1 from './Components/SectionTools/SettingPopup/GoogleMap/design1';

import SettingHorizontalTab1 from './Components/SectionTools/SettingPopup/HorizontalTab/design1';

import SettingMeetTheTeam1 from './Components/SectionTools/SettingPopup/MeetTheTeam/setting';

import SettingSocialMediaLink1 from './Components/SectionTools/SettingPopup/SocialMediaLink/design1';

import SettingVerticalTab1 from './Components/SectionTools/SettingPopup/VerticalTab/design1';

import SettingSplitContent from './Components/SectionTools/SettingPopup/SplitContent/setting';

import SettingOpeningHours from './Components/SectionTools/SettingPopup/OpeningHours/setting';

import SettingPopupProject1 from './Components/SectionTools/SettingPopup/Project/setting1';

import SettingPopupService1 from './Components/SectionTools/SettingPopup/Service/setting';

import SettingPopupTestimonials1 from './Components/SectionTools/SettingPopup/Testimonials/setting';

import SettingPopupClients1 from './Components/SectionTools/SettingPopup/Clients/setting';

import SettingPopupBlogList1 from './Components/SectionTools/SettingPopup/BlogList/setting';

import SettingPopupSubscribe from './Components/SectionTools/SettingPopup/Subscribe/setting';

class PageEditor extends React.Component {
  constructor(props) {
    super(props);
    const hostname = window.location.hostname;
    const subDomain = hostname.substring(0, hostname.indexOf('.'));

    this.state = {
      subDomain,
      path: props.location.query.path ? props.location.query.path : '/',
      histories: [],
      error: null,
    };
  }

  componentWillMount() {
    request.get(`${apiUrl}/Website/${this.state.subDomain}/Page?path=${this.state.path}`, {}, (response) => {
      if (response.data) {
        // response.data.Header = JSON.parse(response.data.Header);
        response.data.Body = JSON.parse(response.data.Body);
        response.data.Body = response.data.Body.filter((o) => o.id != null);
        // response.data.Footer = JSON.parse(response.data.Footer);
        this.props.onPageDataLoaded(response.data, this.state.subDomain, this.state.path);
      } else {
        this.setState({ error: response.error });
      }
    });
  }

  getSubdomain() {
    let hostname = window.location.hostname;
    hostname = hostname.substring(0, hostname.indexOf('.'));
    return hostname;
  }

  render() {
    const { pageData, activeSection, onShowSectionList, gridMode } = this.props;
    if (pageData) {
      return (
        <div className={styles.container}>
          <TopBar />
          <Template id={pageData.get('TemplateId')} className={`page-${pageData.get('Name')}`}>
            { /* SectionLoaders.getHeader(pageData.get('Header').toJS()) */ }
            {
              pageData.get('Body').map((section, index) => {
                const active = activeSection && section.get('id') === activeSection.id;
                const children = [];
                children.push(
                  active ? (
                    <SectionTools
                      key={`section_tools_${section.get('id')}`}
                      index={index}
                      section={section}
                      sectionID={section.get('id')}
                      fluid={section.get('fluid')}
                      active={activeSection && section.get('id') === activeSection.id}
                    />
                  ) : (<Mask key={`mask_tools_${section.get('id')}`} sectionID={section.get('id')} />)
                );
                const params = {
                  ...section.toJS(),
                  sectionGrid: {
                    top: (<SectionGrid option="top" />),
                    left: (<SectionGrid option="left" />),
                    right: (<SectionGrid option="right" />),
                    bottom: (<SectionGrid option="bottom" />),
                  },
                  children,
                  gridMode,
                  editMode: true,
                  activeSection: activeSection ? activeSection.id : null,
                };
                return SectionLoaders.getBody(params);
              })
            }
            { pageData.get('Body').count() === 0 &&
              <div className="section-container">
                <button
                  className={styles.emptyBody}
                  onClick={() => onShowSectionList(0)}
                >
                  + Add a new section
                </button>
              </div>
            }
            { /* SectionLoaders.getFooter(pageData.get('Footer').toJS()) */ }
          </Template>

          <SectionList />
          <HyperLink />
          <FileManager />
          <SectionDesigns />

          { /* Setting Popup */ }
          <SettingAboutUs1 />
          <SettingAboutUs11 />

          <SettingBanner1 allowPopup="showSettingPopupBanner2" />

          <SettingCalendar2 />

          <SettingFAQ1 allowPopup="showSettingPopupFAQ1" />

          <SettingGoogleMap1 />

          <SettingHorizontalTab1 />

          <SettingMeetTheTeam1 allowPopup="showSettingPopupMeetTheTeam5" />

          <SettingSocialMediaLink1 />

          <SettingVerticalTab1 />

          <SettingSplitContent allowPopup="showSettingPopupSplitContent3" />
          <SettingSplitContent allowPopup="showSettingPopupSplitContent6" />
          <SettingSplitContent allowPopup="showSettingPopupSplitContent8" />

          <SettingOpeningHours allowPopup="showSettingPopupOpeningHours2" />
          <SettingOpeningHours allowPopup="showSettingPopupOpeningHours8" />

          <SettingPopupProject1 allowPopup="showSettingPopupProject1" />
          <SettingPopupProject1 allowPopup="showSettingPopupProject3" />

          <SettingPopupService1 />

          <SettingPopupTestimonials1 allowPopup="showSettingPopupTestimonials1" />

          <SettingPopupClients1 allowPopup="showSettingPopupClients1" />

          <SettingPopupBlogList1 allowPopup="showSettingPopupBlogList3" />

          <SettingPopupSubscribe allowPopup="showSettingPopupSubscribe1" />
          { /* End Setting Popup*/ }
        </div>
      );
    } else if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
    return <LoadingPage />;
  }
}

PageEditor.propTypes = {
  location: PropTypes.object.isRequired,
  pageData: PropTypes.object,
  onPageDataLoaded: PropTypes.func.isRequired,
  activeSection: PropTypes.object,
  onShowSectionList: PropTypes.func.isRequired,
  gridMode: PropTypes.bool.isRequired,
};

PageEditor.defaultProps = {
  pageData: null,
  activeSection: null,
};

function mapStateToProps(reducer) {
  const state = reducer.get('pageEditor');
  const activeSectionID = state.get('activeSectionID');
  return {
    pageData: state.get('pageData'),
    gridMode: state.get('gridMode'),
    activeSection: activeSectionID ? state.get('pageData').get('Body').toJS().find((x) => x.id === activeSectionID) : null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPageDataLoaded: (pageData, websiteID, path) => dispatch(pageDataLoaded(pageData, websiteID, path)),
    onShowSectionList: (index) => dispatch(showSectionList(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageEditor);
