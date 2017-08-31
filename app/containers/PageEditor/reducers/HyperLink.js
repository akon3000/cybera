import {
  SHOW_HYPER_LINK,
  HIDE_HYPER_LINK,
} from '../constants';

function hyperLinkReducer(state, action) {
  switch (action.type) {
    case SHOW_HYPER_LINK: return state.set('popup', 'showHyperLink').set('hyperLinkData', {
      id: action.id, imageType: action.imageType, sectionID: action.sectionID, link: action.link,
    });
    case HIDE_HYPER_LINK: return state.set('popup', false).set('hyperLinkData', null);
    default: return state;
  }
}

export default hyperLinkReducer;
