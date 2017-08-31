import { getSection, updateSection } from '../utils';
import {
  CHOOSE_FILE_FROM_FILE_MANAGER,
  DELETE_IMAGE_COMPONENT,
  SET_HYPER_LINK,
} from '../../constants';

function BannerReducer(state, action) {
  switch (action.type) {

    case CHOOSE_FILE_FROM_FILE_MANAGER: {
      const { sectionGroup, sectionID, id, imageType } = state.get('fileManagerParams');
      if (imageType === 'BackgroundImage') return state;
      if (sectionGroup === 'Body') {
        const section = getSection(state, sectionID);
        if (section.name === 'Banner' && imageType === 'BannerGrid') {
          const index = section.data.bannerItems.findIndex((x) => x.id === id);
          section.data.bannerItems[index] = {
            ...section.data.bannerItems[index],
            url: action.file.url,
          };
          return updateSection(state, section).set('popup', false);
        }
      }
      return state;
    }

    case SET_HYPER_LINK: {
      const { linkData } = action;
      const section = getSection(state, linkData.sectionID);
      if (section.name === 'Banner' && linkData.imageType === 'BannerGrid') {
        const index = section.data.bannerItems.findIndex((x) => x.id === linkData.id);
        section.data.bannerItems[index] = { ...section.data.bannerItems[index], link: { ...linkData.link } };
        return updateSection(state, section).set('popup', false).set('hyperLinkData', null);
      }
      return state;
    }

    case DELETE_IMAGE_COMPONENT: {
      const { sectionGroup, sectionID, id, imageType } = action;
      if (sectionGroup === 'Body') {
        const section = getSection(state, sectionID);
        if (section.name === 'Banner' && imageType === 'BannerGrid') {
          const index = section.data.bannerItems.findIndex((x) => x.id === id);
          section.data.bannerItems[index] = {
            ...section.data.bannerItems[index],
            url: null,
          };
          return updateSection(state, section).set('popup', false);
        }
      }
      return state;
    }

    default:
      return state;
  }
}

export default BannerReducer;
