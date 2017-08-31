import { getSection, updateSection } from '../utils';
import {
  CHOOSE_FILE_FROM_FILE_MANAGER,
  DELETE_IMAGE_COMPONENT,
  TINY_MCE_TEXT_CHANGE,
  SET_HYPER_LINK,
} from '../../constants';

function AboutUsReducer(state, action) {
  switch (action.type) {

    case (TINY_MCE_TEXT_CHANGE): {
      const { sectionID, textBoxType, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'AboutUs') {
        switch (textBoxType) {
          case 'contentAboutUs1': section.data.text = content; return updateSection(state, section);
          case 'AboutUs11titleOrderA': section.data.titleA = content; return updateSection(state, section);
          case 'AboutUs11titleOrderB': section.data.titleB = content; return updateSection(state, section);
          case 'AboutUs11content': section.data.content = content; return updateSection(state, section);
          default: return state;
        }
      }
      return state;
    }

    case (CHOOSE_FILE_FROM_FILE_MANAGER): {
      const { sectionID, imageType } = state.get('fileManagerParams');
      if (imageType === 'BackgroundImage') return state;
      const section = getSection(state, sectionID);
      if (
        section.name === 'AboutUs' &&
        (imageType === 'AboutUsImage1' || imageType === 'AboutUsImage11')
      ) {
        section.data.image = { ...section.data.image, url: action.file.url };
        return updateSection(state, section).set('popup', false);
      }
      return state;
    }

    case DELETE_IMAGE_COMPONENT: {
      const { sectionID, imageType } = action;
      const section = getSection(state, sectionID);
      if (
        section.name === 'AboutUs' &&
        (imageType === 'AboutUsImage1' || imageType === 'AboutUsImage11')
      ) {
        section.data.image = { ...section.data.image, url: null };
        return updateSection(state, section);
      }
      return state;
    }

    case SET_HYPER_LINK: {
      const { linkData } = action;
      const section = getSection(state, linkData.sectionID);
      if (
        section.name === 'AboutUs' &&
        (linkData.imageType === 'AboutUsImage1' || linkData.imageType === 'AboutUsImage11')
      ) {
        section.data.image = { ...section.data.image, link: { ...linkData.link } };
        return updateSection(state, section).set('popup', false).set('hyperLinkData', null);
      }
      return state;
    }

    default: return state;

  }
}

export default AboutUsReducer;
