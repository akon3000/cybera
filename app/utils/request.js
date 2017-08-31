import 'whatwg-fetch';
import objectToParams from './objectToParams';
import auth from './auth';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    if (response.status === 204) {
      return true;
    }

    return response.json();
  }

  if (response.status === 0) {
    return response.json().then((err) => err);
  }

  if (response.status === 401) {
    if (response.statusText === 'Your permission is change. Please login again.') {
      auth.logout(() => {
        window.location = '/AccessDenied';
      });
    } else {
      window.location = '/AccessDenied';
    }
    return true;
  }

  return response.json().then((err) => { throw err; });
}

function call(method = 'GET', url, bodyParams, callback = undefined) {
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    mode: 'no-cors',
  };

  if (localStorage.getItem('token')) {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  let fetchParams = {
    method,
    headers,
  };

  if (method !== 'GET') {
    fetchParams = Object.assign(fetchParams, { body: objectToParams(bodyParams) });
  }

  return fetch(url, fetchParams)
  .then(checkStatus)
  .then((data) => {
    if (callback !== undefined) {
      callback({ data });
    }
    return { data };
  })
  .catch((err) => {
    let error = 'Oops! Something went wrong. Please try again.';
    let status = null;
    if (err.Message) {
      error = err.Message;
    }
    if (err.ModelState) {
      Object.keys(err.ModelState).forEach((key) => {
        status = err.ModelState[key][0];
      });
    }

    if (callback !== undefined) {
      if (status) callback({ error, status });
      callback({ error });
    }
    return { error };
  });
}

const request = {

  get(url, bodyParams, callback = undefined) {
    return call('GET', url, bodyParams, callback);
  },

  post(url, bodyParams, callback = undefined) {
    return call('POST', url, bodyParams, callback);
  },

  put(url, bodyParams, callback = undefined) {
    return call('PUT', url, bodyParams, callback);
  },

  patch(url, bodyParams, callback = undefined) {
    return call('PATCH', url, bodyParams, callback);
  },

  delete(url, bodyParams, callback = undefined) {
    return call('DELETE', url, bodyParams, callback);
  },

  fetch(url, params, callback = undefined) {
    return fetch(url, params)
      .then(checkStatus)
      .then((data) => {
        if (callback !== undefined) {
          callback(data);
        }
        return data;
      })
      .catch((err) => {
        let error = 'Oops! Something went wrong. Please try again.';
        if (err.Message) {
          error = err.Message;
        }

        if (callback !== undefined) {
          callback({ error });
        }
        return { error };
      });
  },

  download(url, callback = undefined) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          if (response.status === 204) {
            return true;
          }
          return response.blob();
        }

        if (response.status === 0) {
          return response.blob().then((err) => err);
        }

        return response.blob().then((err) => { throw err; });
      })
      .then((data) => {
        if (callback !== undefined) {
          callback(data);
        }
        return data;
      })
      .catch((err) => {
        let error = 'Oops! Something went wrong. Please try again.';
        if (err.Message) {
          error = err.Message;
        }

        if (callback !== undefined) {
          callback({ error });
        }
        return { error };
      });
  },
};

export default request;
