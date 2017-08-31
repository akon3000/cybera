import { getSection, updateSection } from '../utils';
import {
  TINY_MCE_TEXT_CHANGE,
  SET_HYPER_LINK,
  CHOOSE_FILE_FROM_FILE_MANAGER,
  DELETE_IMAGE_COMPONENT,
} from '../../constants';

function MeetTheTeamReducer(state, action) {
  switch (action.type) {

    case TINY_MCE_TEXT_CHANGE: {
      const { id, sectionID, textBoxType, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'MeetTheTeam') {
        if (textBoxType === 'title') {
          section.data.title = content;
          return updateSection(state, section);
        }
        if (textBoxType === 'teamList') {
          const tempID = id.split('-');
          const idx = tempID[tempID.length - 1];
          const index = section.data.teamList.findIndex((x) => x.id === parseInt(idx, 10));
          section.data.teamList[index] = { ...section.data.teamList[index], descrip: content };
          return updateSection(state, section);
        }
        return state;
      }
      return state;
    }

    case SET_HYPER_LINK: {
      const { linkData } = action;
      const section = getSection(state, linkData.sectionID);
      if (section.id === linkData.sectionID && linkData.imageType === 'teamList') {
        const index = section.data.teamList.findIndex((x) => x.id === linkData.id);
        section.data.teamList[index] = { ...section.data.teamList[index], link: { ...linkData.link } };
        return updateSection(state, section).set('popup', false).set('hyperLinkData', null);
      }
      return state;
    }

    case CHOOSE_FILE_FROM_FILE_MANAGER: {
      const { sectionGroup, sectionID, id, imageType } = state.get('fileManagerParams');
      if (imageType === 'BackgroundImage') return state;
      if (sectionGroup === 'Body') {
        const section = getSection(state, sectionID);
        if (section.id === sectionID && imageType === 'teamList') {
          const index = section.data.teamList.findIndex((x) => x.id === id);
          section.data.teamList[index] = { ...section.data.teamList[index], url: action.file.url };
          return updateSection(state, section).set('popup', false);
        }
        return state;
      }
      return state;
    }

    case DELETE_IMAGE_COMPONENT: {
      const { sectionID, id, imageType } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'MeetTheTeam' && imageType === 'teamList') {
        const index = section.data.teamList.findIndex((x) => x.id === id);
        section.data.teamList[index] = { ...section.data.teamList[index], url: null };
        return updateSection(state, section).set('popup', false);
      }
      return state;
    }

    default:
      return state;
  }
}

export default MeetTheTeamReducer;
