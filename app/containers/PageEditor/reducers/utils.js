import { fromJS } from 'immutable';

export const updatePageData = (state, newPageData) => {
  if (state.get('history').size - 1 === state.get('currentHistory')) {
    return state
            .set('history', state.get('history').push(newPageData))
            .set('currentHistory', state.get('history').size)
            .set('pageData', newPageData);
  }

  return state
          .set('history', state.get('history')
                                  .push(state.get('pageData'))
                                  .push(newPageData))
          .set('currentHistory', state.get('history').size + 1)
          .set('pageData', newPageData);
};

export const getSection = (state, sectionID, sectionGroup = 'Body') =>
        state
          .get('pageData')
          .get(sectionGroup)
          .toJS()
          .find((x) => x.id === sectionID);

export const getActiveSection = (state) => {
  const sectionID = state.get('activeSectionID');
  return getSection(state, sectionID);
};

export const updateSection = (state, section, sectionGroup = 'Body') => {
  const newSections = state
                      .get('pageData')
                      .get(sectionGroup)
                      .map((item) => {
                        if (item.get('id') === section.id) {
                          return fromJS(section);
                        }
                        return item;
                      });
  const newPageData = state
                        .get('pageData')
                        .set(sectionGroup, fromJS(newSections));
  return updatePageData(state, newPageData);
};

