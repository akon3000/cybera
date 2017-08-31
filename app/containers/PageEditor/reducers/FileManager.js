import {
  SHOW_FILE_MANAGER,
  HIDE_FILE_MANAGER,
} from '../constants';

function fileManagerReducer(state, action) {
  switch (action.type) {
    case SHOW_FILE_MANAGER: {
      const { type, ...params } = action;
      return state
              .set('popup', 'showFileManager')
              .set('fileManagerParams', params);
    }

    case HIDE_FILE_MANAGER: {
      return state.set('popup', false);
    }

    default:
      return state;
  }
}

export default fileManagerReducer;
