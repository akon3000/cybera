import { fromJS } from 'immutable';
import { updatePageData, getSection, updateSection } from './utils';

import {
  SELECT_SECTION,
  MOVE_SECTION_UP,
  MOVE_SECTION_DOWN,

  SHOW_SECTION_LIST,
  HIDE_SECTION_LIST,
  ADD_SECTION,
  DELETE_SECTION,

  SHOW_SECTION_DESIGNS,
  HIDE_SECTION_DESIGNS,
  CHANGE_SECTION_DESIGN,

  FLUID_CHANGE,
} from '../constants';

function sectionReducer(state, action) {
  switch (action.type) {
    case SELECT_SECTION:
      return state.set('activeSectionID', action.activeSection);

    case MOVE_SECTION_UP: {
      if (action.index > 0) {
        const currentSection = state.get('pageData').get('Body').get(action.index);
        const newBody = state.get('pageData').get('Body')
                .insert(action.index - 1, currentSection)
                .delete(action.index + 1);
        const newPageData = state.get('pageData').set('Body', newBody);

        return updatePageData(state, newPageData);
      }
      return state;
    }

    case MOVE_SECTION_DOWN: {
      const body = state.get('pageData').get('Body');
      if (action.index < body.size - 1) {
        const currentSection = state.get('pageData').get('Body').get(action.index);
        const newBody = state.get('pageData').get('Body')
                .insert(action.index + 2, currentSection)
                .delete(action.index);
        const newPageData = state.get('pageData').set('Body', newBody);

        return updatePageData(state, newPageData);
      }
      return state;
    }

    case SHOW_SECTION_LIST: {
      return state.set('popup', 'showSectionList').set('addSectionIndex', action.index);
    }

    case HIDE_SECTION_LIST: {
      return state.set('popup', false).set('addSectionIndex', null);
    }

    case ADD_SECTION: {
      const body = state.get('pageData').get('Body').toJS();
      const id = body.length > 0 ? Math.max(...body.map((o) => o.id)) : 0;
      const section = { id: id + 1, ...action.section };
      body.splice(state.get('addSectionIndex'), 0, section);
      const newPageData = state.get('pageData').set('Body', fromJS(body));

      return updatePageData(state, newPageData)
              .set('pageData', newPageData)
              .set('popup', false).set('addSectionIndex', null);
    }

    case DELETE_SECTION: {
      const body = state.get('pageData').get('Body').toJS();
      const newPageData = state.get('pageData').set('Body', fromJS(body.filter((x) => x.id !== action.sectionID)));
      return updatePageData(state, newPageData)
              .set('pageData', newPageData);
    }

    case SHOW_SECTION_DESIGNS: {
      return state
              .set('popup', 'showSectionDesigns');
    }

    case HIDE_SECTION_DESIGNS: {
      return state.set('popup', false);
    }

    case FLUID_CHANGE: {
      let section = getSection(state, state.get('activeSectionID'));
      section = { ...section, fluid: action.fluid };
      return updateSection(state, section);
    }

    case CHANGE_SECTION_DESIGN: {
      const sectionID = action.sectionID;
      const sectionDesign = action.sectionDesign;

      let body = state.get('pageData').get('Body').toJS();
      body = body.map((item) => {
        if (item.id === sectionID) {
          return { ...item, design: sectionDesign };
        }
        return item;
      });

      const newPageData = state
                            .get('pageData')
                            .set('Body', fromJS(body));

      return updatePageData(state, newPageData)
              .set('pageData', newPageData)
              .set('popup', false);
    }

    default:
      return state;
  }
}
export default sectionReducer;
