import {
  CHANGE_SECTION_BACKGROUND,
  UPDATE_SECTION_BACKGROUND,
  CHOOSE_FILE_FROM_FILE_MANAGER,
} from '../constants';

import { getSection, updatePageData, updateSection } from './utils';

function backgroundEditorReducer(state, action) {
  switch (action.type) {
    case CHANGE_SECTION_BACKGROUND: {
      const newSections = state
                      .get('pageData')
                      .get('Body')
                      .map((item) => {
                        if (item.get('id') === state.get('activeSectionID')) {
                          return item.set('containerStyle', action.style);
                        }
                        return item;
                      });
      const newPageData = state
                        .get('pageData')
                        .set('Body', newSections);
      return state.set('pageData', newPageData);
    }

    case UPDATE_SECTION_BACKGROUND: {
      const newSections = state
                      .get('pageData')
                      .get('Body')
                      .map((item) => {
                        if (item.get('id') === state.get('activeSectionID')) {
                          return item.set('containerStyle', action.style);
                        }
                        return item;
                      });
      const newPageData = state
                        .get('pageData')
                        .set('Body', newSections);
      return updatePageData(state, newPageData);
    }

    case CHOOSE_FILE_FROM_FILE_MANAGER: {
      const { imageType } = state.get('fileManagerParams');
      const sectionID = state.get('activeSectionID');
      if (imageType === 'BackgroundImage') {
        let section = getSection(state, sectionID);
        section = {
          ...section,
          containerStyle: {
            ...section.containerStyle,
            backgroundImage: `url('${action.file.url}')`,
          },
        };
        return updateSection(state, section).set('popup', false);
      }
      return state;
    }

    default:
      return state;
  }
}

export default backgroundEditorReducer;
