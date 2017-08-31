import { getSection, updateSection } from '../utils';
import {
  TINY_MCE_TEXT_CHANGE,
  SET_HYPER_LINK,
  CHOOSE_FILE_FROM_FILE_MANAGER,
  DELETE_IMAGE_COMPONENT,
} from '../../constants';

function ProjectReducer(state, action) {
  switch (action.type) {

    case TINY_MCE_TEXT_CHANGE: {
      const { id, sectionID, textBoxType, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'Project') {
        switch (textBoxType) {
          case 'title': section.data.title = content; return updateSection(state, section);
          case 'contentList': {
            const tempID = id.split('-');
            const idx = tempID[tempID.length - 1];
            const index = section.data.projectList.findIndex((x) => x.id === parseInt(idx, 10));
            section.data.projectList[index] = { ...section.data.projectList[index], content };
            return updateSection(state, section);
          }
          case 'buttonList': {
            const tempID = id.split('-');
            const idx = tempID[tempID.length - 1];
            const index = section.data.projectList.findIndex((x) => x.id === parseInt(idx, 10));
            section.data.projectList[index].button = { ...section.data.projectList[index].button, content };
            return updateSection(state, section);
          }
          default: return state;
        }
      }
      return state;
    }

    case CHOOSE_FILE_FROM_FILE_MANAGER: {
      const { sectionID, id, imageType } = state.get('fileManagerParams');
      if (imageType === 'BackgroundImage') return state;
      const section = getSection(state, sectionID);
      if (section.name === 'Project' && imageType === 'projectList') {
        const index = section.data.projectList.findIndex((x) => x.id === id);
        section.data.projectList[index] = { ...section.data.projectList[index], image: { ...section.data.projectList[index].image, url: action.file.url } };
        return updateSection(state, section).set('popup', false);
      }
      return state;
    }

    case DELETE_IMAGE_COMPONENT: {
      const { sectionID, id, imageType } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'Project' && imageType === 'projectList') {
        const index = section.data.projectList.findIndex((x) => x.id === id);
        section.data.projectList[index] = { ...section.data.projectList[index], image: { ...section.data.projectList[index].image, url: null } };
        return updateSection(state, section).set('popup', false);
      }
      return state;
    }

    case SET_HYPER_LINK: {
      const { linkData } = action;
      const section = getSection(state, linkData.sectionID);
      if (section.name === 'Project' && linkData.imageType === 'projectList') {
        const index = section.data.projectList.findIndex((x) => x.id === linkData.id);
        section.data.projectList[index] = { ...section.data.projectList[index], image: { ...section.data.projectList[index].image, link: { ...linkData.link } } };
        return updateSection(state, section).set('popup', false).set('hyperLinkData', null);
      }
      return state;
    }

    default: return state;
  }
}

export default ProjectReducer;
