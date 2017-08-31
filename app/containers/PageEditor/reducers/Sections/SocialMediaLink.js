import { getSection, updateSection } from '../utils';
import {
  TINY_MCE_TEXT_CHANGE,
  SET_HYPER_LINK,
  CHOOSE_FILE_FROM_FILE_MANAGER,
} from '../../constants';

function SocialMediaLinkReducer(state, action) {
  switch (action.type) {

    case TINY_MCE_TEXT_CHANGE: {
      const { sectionID, textBoxType, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'SocialMediaLink' && textBoxType === 'title') {
        section.data.title = content;
        return updateSection(state, section);
      }
      return state;
    }

    case SET_HYPER_LINK: {
      const { linkData } = action;
      const section = getSection(state, linkData.sectionID);
      if (section.name === 'SocialMediaLink' && linkData.imageType === 'topImageBG') {
        section.data = { ...section.data, topImageLink: { ...linkData.link } };
        return updateSection(state, section).set('popup', false).set('hyperLinkData', null);
      }
      return state;
    }

    case CHOOSE_FILE_FROM_FILE_MANAGER: {
      const { sectionID, imageType } = state.get('fileManagerParams');
      if (imageType === 'BackgroundImage') return state;
      const section = getSection(state, sectionID);
      switch (imageType) {
        case 'topImageBG': {
          section.data.topImage = action.file.url;
          return updateSection(state, section).set('popup', false);
        }
        default:
          return state;
      }
    }

    default:
      return state;
  }
}

export default SocialMediaLinkReducer;
