import { getSection, updateSection } from '../utils';
import {
  TINY_MCE_TEXT_CHANGE,
  SET_HYPER_LINK,
  CHOOSE_FILE_FROM_FILE_MANAGER,
  DELETE_IMAGE_COMPONENT,
} from '../../constants';

function ClientsReducer(state, action) {
  switch (action.type) {

    case TINY_MCE_TEXT_CHANGE: {
      const { sectionID, textBoxType, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'Clients' && textBoxType === 'title') {
        section.title = content;
        return updateSection(state, section);
      }
      return state;
    }

    case SET_HYPER_LINK: {
      const { linkData } = action;
      const section = getSection(state, linkData.sectionID);
      if (section.name === 'Clients' && linkData.imageType === 'ImageClient') {
        const index = section.data.items.findIndex((x) => x.id === linkData.id);
        section.data.items[index] = { ...section.data.items[index], link: { ...linkData.link } };
        return updateSection(state, section).set('popup', false).set('hyperLinkData', null);
      }
      return state;
    }

    case CHOOSE_FILE_FROM_FILE_MANAGER: {
      const { sectionID, id, imageType } = state.get('fileManagerParams');
      if (imageType === 'BackgroundImage') return state;
      const section = getSection(state, sectionID);
      if (section.name === 'Clients' && imageType === 'ImageClient') {
        const index = section.data.items.findIndex((x) => x.id === id);
        section.data.items[index] = { ...section.data.items[index], url: action.file.url };
        return updateSection(state, section).set('popup', false);
      }
      return state;
    }

    case DELETE_IMAGE_COMPONENT: {
      const { sectionID, id, imageType } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'Clients' && imageType === 'ImageClient') {
        const index = section.data.items.findIndex((x) => x.id === id);
        section.data.items[index] = { ...section.data.items[index], url: null };
        return updateSection(state, section).set('popup', false);
      }
      return state;
    }

    default:
      return state;
  }
}

export default ClientsReducer;
