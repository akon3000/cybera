import {
  CHOOSE_FILE_FROM_FILE_MANAGER,
  DELETE_IMAGE_COMPONENT,
  SET_HYPER_LINK,
} from '../../constants';

import { getSection, updateSection } from '../utils';

function ImageSliderReducer(state, action) {
  switch (action.type) {
    case CHOOSE_FILE_FROM_FILE_MANAGER: {
      const { sectionGroup, sectionID, id, imageType } = state.get('fileManagerParams');
      if (imageType === 'BackgroundImage') return state;
      if (sectionGroup === 'Body') {
        const section = getSection(state, sectionID);
        if (section.name === 'ImageSlider') {
          if (imageType === 'items') {
            if (id !== 0) {
              const index = section.data.items.findIndex((x) => x.id === id);
              section.data.items[index] = {
                ...section.data.items[index],
                backgroundImage: action.file.url,
              };
            } else {
              const maxId = Math.max(...section.data.items.map((o) => o.id));
              section.data.items.push({
                id: maxId + 1,
                backgroundImage: action.file.url,
              });
            }
            return updateSection(state, section).set('popup', false);
          }
          return state.set('popup', false);
        }
      }
      return state;
    }

    case SET_HYPER_LINK: {
      const { linkData } = action;
      const section = getSection(state, linkData.sectionID);
      if (section.name === 'ImageSlider' && linkData.imageType === 'items') {
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
        if (section.name === 'ImageSlider') {
          if (imageType === 'items') {
            const items = section.data.items.filter((x) => x.id !== id);
            section.data.items = items;
            return updateSection(state, section);
          }
          return state;
        }
      }
      return state;
    }

    default:
      return state;
  }
}

export default ImageSliderReducer;
