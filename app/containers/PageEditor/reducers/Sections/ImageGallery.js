import { getSection, updateSection } from '../utils';
import {
  CHOOSE_FILE_FROM_FILE_MANAGER,
  SET_HYPER_LINK,
  DELETE_IMAGE_COMPONENT,
  TINY_MCE_TEXT_CHANGE,
} from '../../constants';

function imageSlideReducer(state, action) {
  switch (action.type) {

    case CHOOSE_FILE_FROM_FILE_MANAGER: {
      const { sectionGroup, sectionID, id, imageType } = state.get('fileManagerParams');
      if (imageType === 'BackgroundImage') return state;
      if (sectionGroup === 'Body') {
        const section = getSection(state, sectionID);
        if (section.name === 'ImageGallery' && imageType === 'ImageGallery') {
          if (id !== 0) {
            const index = section.data.items.findIndex((x) => x.id === id);
            section.data.items[index] = {
              ...section.data.items[index],
              url: action.file.url,
            };
          } else {
            const maxId = Math.max(...section.data.items.map((o) => o.id));
            section.data.items.push({
              id: maxId + 1,
              url: action.file.url,
            });
          }
          return updateSection(state, section).set('popup', false);
        }
      }
      return state;
    }

    case SET_HYPER_LINK: {
      const { linkData } = action;
      const section = getSection(state, linkData.sectionID);
      if (section.name === 'ImageGallery' && linkData.imageType === 'ImageGallery') {
        const index = section.data.items.findIndex((x) => x.id === linkData.id);
        section.data.items[index] = { ...section.data.items[index], link: { ...linkData.link } };
        return updateSection(state, section).set('popup', false).set('hyperLinkData', null);
      }
      return state;
    }

    case DELETE_IMAGE_COMPONENT: {
      const { sectionGroup, sectionID, id, imageType } = action;
      if (sectionGroup === 'Body') {
        const section = getSection(state, sectionID);
        if (section.name === 'ImageGallery' && imageType === 'ImageGallery') {
          const items = section.data.items.filter((x) => x.id !== id);
          section.data.items = items;
          return updateSection(state, section);
        }
      }
      return state;
    }

    case TINY_MCE_TEXT_CHANGE: {
      const { sectionGroup, sectionID, textBoxType, content } = action;
      if (sectionGroup === 'Body') {
        const section = getSection(state, sectionID);
        if (section.name === 'ImageGallery' && textBoxType === 'description') {
          section.data.description = content;
          return updateSection(state, section);
        }
      }
      return state;
    }

    default:
      return state;
  }
}

export default imageSlideReducer;
