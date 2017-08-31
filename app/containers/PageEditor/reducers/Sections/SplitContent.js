import { getSection, updateSection } from '../utils';
import {
  TINY_MCE_TEXT_CHANGE,
} from '../../constants';

function SplitContentReducer(state, action) {
  switch (action.type) {

    case TINY_MCE_TEXT_CHANGE: {
      const { sectionID, textBoxType, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'SplitContent') {
        const index = section.data.colum.findIndex((x) => x.id === parseInt(textBoxType, 10));
        section.data.colum[index] = { ...section.data.colum[index], content };
        return updateSection(state, section);
      }
      return state;
    }

    default: return state;
  }
}

export default SplitContentReducer;
