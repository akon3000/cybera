import { getSection, updateSection } from '../utils';
import {
  TINY_MCE_TEXT_CHANGE,
} from '../../constants';

function GoogleMapReducer(state, action) {
  switch (action.type) {

    case TINY_MCE_TEXT_CHANGE: {
      const { sectionID, textBoxType, content } = action;
      const section = getSection(state, sectionID);
      if (section.name === 'GoogleMap') {
        switch (textBoxType) {
          case 'title': {
            section.data.title = content;
            return updateSection(state, section);
          }
          case 'clientContent': {
            section.data.clientContent = content;
            return updateSection(state, section);
          }
          default: return state;
        }
      }
      return state;
    }

    default:
      return state;
  }
}

export default GoogleMapReducer;
