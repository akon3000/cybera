import { getSection, updateSection } from './utils';
import {
  SHOW_SETTING_POPUP,
  HIDE_SETTING_POPUP,
  CHANGE_SETTING_POPUP,
} from '../constants';

function settingPopupReducer(state, action) {
  switch (action.type) {

    case SHOW_SETTING_POPUP: {
      const section = getSection(state, state.get('activeSectionID'));
      return state.set('popup', `showSettingPopup${section.design}`)
                  .set('settingPopupData', section.data)
                  .set('settingPopupSetting', section.setting);
    }

    case CHANGE_SETTING_POPUP: {
      let section = getSection(state, state.get('activeSectionID'));
      section = { ...section, data: { ...action.data }, setting: { ...action.setting } };
      return updateSection(state, section)
                .set('popup', false)
                .set('settingPopupData', null)
                .set('settingPopupSetting', null);
    }

    case HIDE_SETTING_POPUP: {
      return state.set('popup', false)
                  .set('settingPopupData', null)
                  .set('settingPopupSetting', null);
    }

    default:
      return state;
  }
}

export default settingPopupReducer;
