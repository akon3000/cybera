import { fromJS } from 'immutable';
import {
  PAGE_DATA_LOADED,
  UNDO,
  REDO,

  GRID_MODE_SWITCH,

  SAVE_PAGE_DATA,
  SAVE_PAGE_DATA_SUCCESS,
  SAVE_PAGE_DATA_SUCCESS_CLEAR,
  SAVE_PAGE_DATA_ERROR,
  SAVE_PAGE_DATA_ERROR_CLEAR,
} from '../constants';

function pageReducer(state, action) {
  switch (action.type) {
    case PAGE_DATA_LOADED:
      return state
              .set('websiteID', action.websiteID)
              .set('path', action.path)
              .set('pageData', fromJS(action.pageData))
              .set('history', state.get('history').push(fromJS(action.pageData)))
              .set('currentHistory', 0);

    case UNDO: {
      if (state.get('history').size > 0 && state.get('currentHistory') > 0) {
        return state.set('currentHistory', state.get('currentHistory') - 1)
                .set('pageData', state.get('history').get(state.get('currentHistory') - 1));
      }
      return state;
    }

    case REDO: {
      if (state.get('history').size > 0 && state.get('currentHistory') < state.get('history').size - 1) {
        return state.set('currentHistory', state.get('currentHistory') + 1)
                .set('pageData', state.get('history').get(state.get('currentHistory') + 1));
      }
      return state;
    }

    case GRID_MODE_SWITCH: {
      return state.set('gridMode', action.value);
    }

    case SAVE_PAGE_DATA:
      return state.set('saving', true);

    case SAVE_PAGE_DATA_SUCCESS: {
      return state.set('saveSuccess', true).set('saving', false);
    }

    case SAVE_PAGE_DATA_SUCCESS_CLEAR: {
      return state.set('saveSuccess', false);
    }

    case SAVE_PAGE_DATA_ERROR: {
      return state.set('error', action.error).set('saving', false);
    }

    case SAVE_PAGE_DATA_ERROR_CLEAR: {
      return state.set('error', false);
    }

    default:
      return state;
  }
}

export default pageReducer;
