import { getSection, updateSection } from '../utils';
import {
  TINY_MCE_TEXT_CHANGE,
  BUTTON_STYLING_CHANGE,
} from '../../constants';

function HorizontalTabReducer(state, action) {
  switch (action.type) {

    case TINY_MCE_TEXT_CHANGE: {
      const { sectionID, textBoxType, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'HorizontalTab' && textBoxType !== 'title') {
        const index = section.data.tabs.findIndex((x) => x.id === parseInt(textBoxType, 10));
        section.data.tabs[index] = { ...section.data.tabs[index], descrip: content };
        return updateSection(state, section);
      }
      if (section.name === 'HorizontalTab' && textBoxType === 'title') {
        section.data.title = content;
        return updateSection(state, section);
      }
      return state;
    }

    case BUTTON_STYLING_CHANGE: {
      const section = getSection(state, action.sectionID);
      if (section.name === 'HorizontalTab') {
        section.setting.tapHeaderStyle = { ...action.settingStyle };
      }
      return updateSection(state, section);
    }

    default: return state;
  }
}

export default HorizontalTabReducer;
