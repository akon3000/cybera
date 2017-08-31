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

  SIGNED_UP_WITH_CYBERA,
  SIGNED_UP_WITH_FACEBOOK,
} from './constants';

export function loadTemplateList() {
  return {
    type: LOAD_TEMPLATE_LIST,
  };
}

export function templateListLoaded(templates) {
  return {
    type: LOAD_TEMPLATE_LIST_SUCCESS,
    templates,
  };
}

export function templateListLoadingError(error) {
  return {
    type: LOAD_TEMPLATE_LIST_ERROR,
    error,
  };
}

export function clickTemplateBox(templateID) {
  return {
    type: CLICK_TEMPLATE,
    templateID,
  };
}

export function closeTemplate(templateID) {
  return {
    type: CLOSE_TEMPLATE,
    templateID,
  };
}

export function showPlan() {
  return {
    type: SHOW_PLAN,
  };
}

export function hidePlan() {
  return {
    type: HIDE_PLAN,
  };
}

export function selectPlan(selectedPlan) {
  return {
    type: SELECT_PLAN,
    selectedPlan,
  };
}

export function shopNameChange(shopName) {
  return {
    type: SHOP_NAME_CHANGE,
    shopName,
  };
}

export function checkShopName(shopName) {
  return {
    type: CHECK_SHOP_NAME,
    shopName,
  };
}

export function checkShopNameSuccess(isAvailable) {
  return {
    type: CHECK_SHOP_NAME_SUCCESS,
    isAvailable,
  };
}

export function checkShopNameError(error) {
  return {
    type: CHECK_SHOP_NAME_ERROR,
    error,
  };
}

export function subDomainChange(subDomain) {
  return {
    type: SUB_DOMAIN_CHANGE,
    subDomain,
  };
}

export function checkSubDomain(subDomain) {
  return {
    type: CHECK_SUB_DOMAIN,
    subDomain,
  };
}

export function checkSubDomainSuccess(isAvailable) {
  return {
    type: CHECK_SUB_DOMAIN_SUCCESS,
    isAvailable,
  };
}

export function checkSubDomainError(error) {
  return {
    type: CHECK_SUB_DOMAIN_ERROR,
    error,
  };
}

export function emailChange(email) {
  return {
    type: EMAIL_CHANGE,
    email,
  };
}

export function checkEmail(email) {
  return {
    type: CHECK_EMAIL,
    email,
  };
}

export function checkEmailSuccess(isAvailable) {
  return {
    type: CHECK_EMAIL_SUCCESS,
    isAvailable,
  };
}

export function checkEmailError(error) {
  return {
    type: CHECK_EMAIL_ERROR,
    error,
  };
}

export function signedUpWithCybera(shopName, subDomain, email, password) {
  return {
    type: SIGNED_UP_WITH_CYBERA,
    shopName,
    subDomain,
    email,
    password,
  };
}

export function signedUpWithFacebook(shopName, subDomain, email, clientID) {
  return {
    type: SIGNED_UP_WITH_FACEBOOK,
    shopName,
    subDomain,
    email,
    clientID,
  };
}
