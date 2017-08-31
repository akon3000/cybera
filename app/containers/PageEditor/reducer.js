import { fromJS } from 'immutable';
import { mergeReducers } from '../../utils/redux';

import PageReducer from './reducers/Page';
import SectionReducer from './reducers/Section';
import HyperLinkReducer from './reducers/HyperLink';
import FileManagerReducer from './reducers/FileManager';
import SettingPopupReducer from './reducers/SettingPopup';
import AboutUsReducer from './reducers/Sections/AboutUs';
import ImageSlideReducer from './reducers/Sections/ImageSlide';
import ImageGalleryReducer from './reducers/Sections/ImageGallery';
import ClientsReducer from './reducers/Sections/Clients';
import SocialMediaLinkReducer from './reducers/Sections/SocialMediaLink';
import BackgroundEditorReducer from './reducers/BackgroundEditor';
import GoogleMapReducer from './reducers/Sections/GoogleMap';
import BannerReducer from './reducers/Sections/Banner';
import FaqReducer from './reducers/Sections/Faq';
import HorizontalTabReducer from './reducers/Sections/HorizontalTab';
import MeetTheTeamReducer from './reducers/Sections/MeetTheTeam';
import VerticalTabReducer from './reducers/Sections/VerticalTab';
import CalendarReducer from './reducers/Sections/Calendar';
import SplitContentReducer from './reducers/Sections/SplitContent';
import OpeningHoursReducer from './reducers/Sections/OpeningHours';
import ProjectReducer from './reducers/Sections/Project';
import ServiceReducer from './reducers/Sections/Service';
import TestimonialsReducer from './reducers/Sections/Testimonials';
import BlogListReducer from './reducers/Sections/BlogList';
import SubscribeReducer from './reducers/Sections/Subscribe';

// The initial state of the App
export const initialState = fromJS({
  pageData: null,
  activeSectionID: null,
  history: [],
  currentHistory: -1,
  saveSuccess: false,
  error: false,
  websiteID: '',
  path: '',
  saving: false,

  addSectionIndex: false,
  popup: false,

  fileManagerCallback: null,

  gridMode: true,
});

function pageEditorReducer(state = initialState, action) {
  return mergeReducers(
    state,
    action,
    [
      PageReducer,
      SectionReducer,
      HyperLinkReducer,
      FileManagerReducer,
      SettingPopupReducer,
      AboutUsReducer,
      ImageSlideReducer,
      ImageGalleryReducer,
      ClientsReducer,
      SocialMediaLinkReducer,
      BackgroundEditorReducer,
      GoogleMapReducer,
      BannerReducer,
      FaqReducer,
      HorizontalTabReducer,
      MeetTheTeamReducer,
      VerticalTabReducer,
      CalendarReducer,
      SplitContentReducer,
      OpeningHoursReducer,
      ProjectReducer,
      ServiceReducer,
      TestimonialsReducer,
      BlogListReducer,
      SubscribeReducer,
    ]);
}

export default pageEditorReducer;
