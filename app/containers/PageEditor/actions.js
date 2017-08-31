import {
  PAGE_DATA_LOADED,

  SELECT_SECTION,
  MOVE_SECTION_UP,
  MOVE_SECTION_DOWN,

  UNDO,
  REDO,

  GRID_MODE_SWITCH,

  SAVE_PAGE_DATA,
  SAVE_PAGE_DATA_SUCCESS,
  SAVE_PAGE_DATA_SUCCESS_CLEAR,
  SAVE_PAGE_DATA_ERROR,
  SAVE_PAGE_DATA_ERROR_CLEAR,

  SHOW_SECTION_LIST,
  HIDE_SECTION_LIST,
  ADD_SECTION,
  DELETE_SECTION,

  SHOW_SECTION_DESIGNS,
  HIDE_SECTION_DESIGNS,
  CHANGE_SECTION_DESIGN,

  SHOW_HYPER_LINK,
  HIDE_HYPER_LINK,
  SET_HYPER_LINK,

  SHOW_FILE_MANAGER,
  HIDE_FILE_MANAGER,
  CHOOSE_FILE_FROM_FILE_MANAGER,

  DELETE_IMAGE_COMPONENT,

  TINY_MCE_TEXT_CHANGE,

  SHOW_SETTING_POPUP,
  HIDE_SETTING_POPUP,
  CHANGE_SETTING_POPUP,

  CHANGE_SECTION_BACKGROUND,
  UPDATE_SECTION_BACKGROUND,

  BUTTON_STYLING_CHANGE,

  FLUID_CHANGE,
} from './constants';

export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });

export const gridSwitch = (value) => ({ type: GRID_MODE_SWITCH, value });

export const pageDataLoaded = (pageData, websiteID, path) => ({ type: PAGE_DATA_LOADED, pageData, websiteID, path });

export const selectSection = (activeSection) => ({ type: SELECT_SECTION, activeSection });

export const moveSectionUp = (index) => ({ type: MOVE_SECTION_UP, index });
export const moveSectionDown = (index) => ({ type: MOVE_SECTION_DOWN, index });

export const savePageData = (websiteID, path, pageData) => ({ type: SAVE_PAGE_DATA, websiteID, path, pageData });
export const savePageDataSuccess = () => ({ type: SAVE_PAGE_DATA_SUCCESS });
export const savePageDataSuccessClear = () => ({ type: SAVE_PAGE_DATA_SUCCESS_CLEAR });
export const savePageDataError = (error) => ({ type: SAVE_PAGE_DATA_ERROR, error });
export const savePageDataErrorClear = () => ({ type: SAVE_PAGE_DATA_ERROR_CLEAR });

export const showSectionList = (index) => ({ type: SHOW_SECTION_LIST, index });
export const hideSectionList = () => ({ type: HIDE_SECTION_LIST });
export const addSection = (section) => ({ type: ADD_SECTION, section });
export const deleteSection = (sectionID) => ({ type: DELETE_SECTION, sectionID });

export const showSectionDesigns = (sectionID) => ({ type: SHOW_SECTION_DESIGNS, sectionID });
export const hideSectionDesigns = () => ({ type: HIDE_SECTION_DESIGNS });
export const changeSectionDesign = (sectionID, sectionDesign) => ({ type: CHANGE_SECTION_DESIGN, sectionID, sectionDesign });

export const showHyperLink = (id, imageType, sectionID, link) => ({ type: SHOW_HYPER_LINK, id, imageType, sectionID, link });
export const hideHyperLink = () => ({ type: HIDE_HYPER_LINK });
export const setHyperLink = (linkData) => ({ type: SET_HYPER_LINK, linkData });

export const showFileManager = (id, imageType, sectionID, sectionGroup) => ({ type: SHOW_FILE_MANAGER, id, imageType, sectionID, sectionGroup });
export const hideFileManager = () => ({ type: HIDE_FILE_MANAGER });
export const chooseFileFromFileManager = (file) => ({ type: CHOOSE_FILE_FROM_FILE_MANAGER, file });

export const deleteImageComponent = (id, imageType, sectionID, sectionGroup) => ({ type: DELETE_IMAGE_COMPONENT, id, imageType, sectionID, sectionGroup });

export const tinyMCETextChange = (id, textBoxType, sectionID, sectionGroup, content) => ({ type: TINY_MCE_TEXT_CHANGE, id, textBoxType, sectionID, sectionGroup, content });

export const showSettingPopup = () => ({ type: SHOW_SETTING_POPUP });
export const hideSettingPopup = () => ({ type: HIDE_SETTING_POPUP });
export const changeSettingPopup = (setting, data) => ({ type: CHANGE_SETTING_POPUP, setting, data });

export const changeSectionBackground = (style) => ({ type: CHANGE_SECTION_BACKGROUND, style });
export const updateSectionBackground = (style) => ({ type: UPDATE_SECTION_BACKGROUND, style });

export const buttonStylingChange = (sectionID, settingStyle) => ({ type: BUTTON_STYLING_CHANGE, sectionID, settingStyle });

export const fluidChange = (fluid) => ({ type: FLUID_CHANGE, fluid });
