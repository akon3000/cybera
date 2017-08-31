import { take, call, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { SAVE_PAGE_DATA } from './constants';
import { savePageDataSuccess, savePageDataError } from './actions';
import { apiUrl } from '../../config';

import request from '../../utils/request';

export const pageDataAPI = (websiteId, path) => `${apiUrl}/Website/${websiteId}/Page?path=${path}`;

export function* postingPageData(action) {
  const pageData = action.pageData.toJS();
  // console.log(JSON.stringify(pageData.Body));
  const requestData = {
    Header: (JSON.stringify(pageData.Header)),
    Body: (JSON.stringify(pageData.Body)),
    Footer: (JSON.stringify(pageData.Footer)),
  };
  const req = yield call(request.put, pageDataAPI(action.websiteID, action.path), requestData);
  if (!req.error) {
    yield put(savePageDataSuccess());
  } else {
    yield put(savePageDataError(req.error));
  }
}

export function* savePageData() {
  const watcher = yield takeLatest(SAVE_PAGE_DATA, postingPageData);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [savePageData];
