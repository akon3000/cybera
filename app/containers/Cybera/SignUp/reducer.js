import { fromJS } from 'immutable';

import {
  LOAD_TEMPLATE_LIST,
  LOAD_TEMPLATE_LIST_SUCCESS,
  LOAD_TEMPLATE_LIST_ERROR,
  CLICK_TEMPLATE,
  CLOSE_TEMPLATE,
  SHOW_PLAN,
  HIDE_PLAN,
  SELECT_PLAN,
  SHOP_NAME_CHANGE,
  CHECK_SHOP_NAME,
  CHECK_SHOP_NAME_SUCCESS,
  CHECK_SHOP_NAME_ERROR,

  SUB_DOMAIN_CHANGE,
  CHECK_SUB_DOMAIN,
  CHECK_SUB_DOMAIN_SUCCESS,
  CHECK_SUB_DOMAIN_ERROR,

  EMAIL_CHANGE,
  CHECK_EMAIL,
  CHECK_EMAIL_SUCCESS,
  CHECK_EMAIL_ERROR,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  templateList: false,
  isShowPlan: false,
  showTemplate: false,
  isClosing: false,
  error: false,
  loading: false,
  selectedPlan: false,

  shopName: '',
  isCheckingShopName: false,
  isShopNameAvailable: true,
  shopNameError: true,

  subDomain: '',
  isCheckingSubDomain: false,
  isSubDomainAvailable: true,
  subDomainError: true,

  email: '',
  isCheckingEmail: false,
  isEmailAvailable: true,
});

function signUpReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TEMPLATE_LIST:
      return state
              .set('loading', true)
              .set('error', false)
              .set('templateList', false);
    case LOAD_TEMPLATE_LIST_SUCCESS:
      return state
              .set('loading', false)
              .set('templateList', action.templates);
    case LOAD_TEMPLATE_LIST_ERROR:
      return state
              .set('loading', false)
              .set('error', action.error);
    case CLICK_TEMPLATE:
      return state.set('isShowPlan', false)
                  .set('showTemplate', action.templateID)
                  .set('isClosing', false);
    case CLOSE_TEMPLATE:
      return state.set('isClosing', true);
    case SHOW_PLAN:
      return state
              .set('isShowPlan', true)
              .set('isClosingPlan', false);
    case HIDE_PLAN:
      return state
              .set('showTemplate', false)
              .set('isClosingPlan', true);
    case SELECT_PLAN:
      return state
              .set('selectedPlan', action.selectedPlan);

    case SHOP_NAME_CHANGE:
      return state
              .set('shopName', action.shopName);
    case CHECK_SHOP_NAME:
      return state
              .set('isCheckingShopName', true)
              .set('shopNameError', true);
    case CHECK_SHOP_NAME_SUCCESS:
      return state
              .set('isCheckingShopName', false)
              .set('isShopNameAvailable', true)
              .set('shopNameError', true);
    case CHECK_SHOP_NAME_ERROR:
      return state
              .set('isCheckingShopName', false)
              .set('isShopNameAvailable', false)
              .set('shopNameError', action.error);
    case SUB_DOMAIN_CHANGE:
      return state
              .set('subDomain', action.subDomain);
    case CHECK_SUB_DOMAIN:
      return state
              .set('isCheckingSubDomain', true)
              .set('subDomainError', true);
    case CHECK_SUB_DOMAIN_SUCCESS:
      return state
              .set('isCheckingSubDomain', false)
              .set('isSubDomainAvailable', true)
              .set('subDomainError', true);
    case CHECK_SUB_DOMAIN_ERROR:
      return state
              .set('isCheckingSubDomain', false)
              .set('isSubDomainAvailable', false)
              .set('subDomainError', action.error);
    case EMAIL_CHANGE:
      return state
              .set('email', action.email);
    case CHECK_EMAIL:
      return state
              .set('isCheckingEmail', true)
              .set('isEmailAvailable', true);
    case CHECK_EMAIL_SUCCESS:
      return state
              .set('isCheckingEmail', false)
              .set('isEmailAvailable', true);
    case CHECK_EMAIL_ERROR:
      return state
              .set('isCheckingEmail', false)
              .set('isEmailAvailable', action.error);
    default:
      return state;
  }
}

export default signUpReducer;
