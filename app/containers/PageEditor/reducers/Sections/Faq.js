import { getSection, updateSection } from '../utils';
import {
  TINY_MCE_TEXT_CHANGE,
} from '../../constants';

function FaqReducer(state, action) {
  switch (action.type) {
    case TINY_MCE_TEXT_CHANGE: {
      const { sectionID, textBoxType, id, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'FAQ') {
        if (textBoxType === 'title') {
          section.data.title = content;
          return updateSection(state, section);
        }
        if (textBoxType === 'faqList') {
          const tempID = id.split('-');
          const idx = tempID[tempID.length - 1];
          const index = section.data.faqList.findIndex((x) => x.id === parseInt(idx, 10));
          section.data.faqList[index] = { ...section.data.faqList[index], content };
          return updateSection(state, section);
        }
        return state;
      }
      return state;
    }
    default: return state;
  }
}

export default FaqReducer;
