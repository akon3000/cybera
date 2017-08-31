import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  LOAD_TEMPLATE_LIST,
  CHECK_SHOP_NAME,
  CHECK_SUB_DOMAIN,
  CHECK_EMAIL,
} from './constants';
import {
  templateListLoaded,
  templateListLoadingError,

  checkShopNameSuccess,
  checkShopNameError,

  checkSubDomainSuccess,
  checkSubDomainError,

  checkEmailSuccess,
  checkEmailError,

} from './actions';
import { apiUrl } from '../../../config';

import request from './../../../utils/request';
export const templateAPI = `${apiUrl}/Templates`;
export const checkShopNameAPI = (shopName) => `${apiUrl}/Websites/WebsiteNameValidation/WebsiteName/${shopName}`;
export const checkSubDomainAPI = (subDomain) => `${apiUrl}/Websites/UrlValidation/Url/${subDomain}`;
export const checkEmailAPI = (email) => `${apiUrl}/Users/EmailValidation?email=${email}`;

/**
 * Template List request/response handler
 */
export function* getTemplateList() {
  const req = yield call(request.get, templateAPI);
  if (!req.error) {
    yield put(templateListLoaded(req.data));
  } else {
    yield put(templateListLoadingError(req.error));
  }
}

export function* getTemplateListWatcher() {
  while (yield take(LOAD_TEMPLATE_LIST)) {
    yield call(getTemplateList);
  }
}

export function* templateList() {
  const watcher = yield fork(getTemplateListWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

/**
 * Checking Shop name
 */
export function* checkingShopName(shopName) {
  const api = checkShopNameAPI(shopName);
  const req = yield call(request.get, api, { WebsiteName: shopName });

  if (!req.error) {
    yield put(checkShopNameSuccess(req.data));
  } else {
    yield put(checkShopNameError(req.error));
  }
}

export function* checkShopNameWatcher() {
  while (true) { // eslint-disable-line
    const { shopName } = yield take(CHECK_SHOP_NAME);
    yield call(checkingShopName, shopName);
  }
}

export function* checkShopName() {
  const watcher = yield fork(checkShopNameWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

/**
 * Checking Sub-Domain
 */
export function* checkingSubDomain(subDomain) {
  const api = checkSubDomainAPI(subDomain);

  const req = yield call(request.get, api);

  if (!req.error) {
    yield put(checkSubDomainSuccess(req.data));
  } else {
    yield put(checkSubDomainError(req.error));
  }
}

export function* checkSubDomainWatcher() {
  while (true) { // eslint-disable-line
    const { subDomain } = yield take(CHECK_SUB_DOMAIN);
    yield call(checkingSubDomain, subDomain);
  }
}

export function* checkSubDomain() {
  const watcher = yield fork(checkSubDomainWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

/**
 * Checking Emailn
 */
export function* checkingEmail(email) {
  const api = checkEmailAPI(email);
  const req = yield call(request.get, api);
  if (!req.error) {
    yield put(checkEmailSuccess(req.data));
  } else {
    yield put(checkEmailError(req.error));
  }
}

export function* checkEmailWatcher() {
  while (true) { // eslint-disable-line
    const { email } = yield take(CHECK_EMAIL);
    yield call(checkingEmail, email);
  }
}

export function* checkEmail() {
  const watcher = yield fork(checkEmailWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  templateList,
  checkShopName,
  checkSubDomain,
  checkEmail,
];
