// const apiUrl = require('../config').apiUrl;
// const request = require('./request');
// const message = require('../Message');

import { apiUrl } from '../config';
import request from './request';
// import message from '../Message';

const loginAPI = `${apiUrl}/Users/token`;
const loginFacebookAPI = `${apiUrl}/Users/token/facebook`;
const forgotPasswordAPI = (email) => `${apiUrl}/Users/ForgotPassword?email=${email}`;
const resetPasswordAPI = `${apiUrl}/Users/ResetPassword`;
const integrateFacebookAPI = `${apiUrl}/Users/IntegratesFacebook`;
// const claimsAPI = `${apiUrl}/Users/Claims`;

const auth = {
  login: (username, password, callback) => {
    request.post(loginAPI, {
      grant_type: 'password',
      username,
      password,
    }, (response) => {
      if (!response.error) {
        localStorage.setItem('token', response.data.access_token);
        callback(response.data);
      } else {
        callback({ error: response.error });
      }
    });
  },

  loginFacebook(clientID, facebookToken, callback) {
    if (this.loggedIn()) {
      callback(true);
      return;
    }

    request.post(
      loginFacebookAPI,
      { ClientId: clientID, Access_token: facebookToken },
      (response) => {
        if (!response.error) {
          localStorage.setItem('token', response.data.access_token);
          callback(response);
        } else {
          callback({ error: response.error });
        }
      }
    );
  },

  getUser(callback) {
    if (!localStorage.getItem('user')) {
      this.updateUser((user) => {
        callback(user);
      });
    } else {
      callback(JSON.parse(localStorage.getItem('user')));
    }
  },

  updateUser(callback) {
    request.get(`${apiUrl}/User`, {}, (response) => {
      if (!response.error) {
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        localStorage.removeItem('user');
      }

      callback(JSON.parse(localStorage.getItem('user')));
    });
  },

  getWebsite(callback) {
    if (!localStorage.getItem('website')) {
      this.updateWebsite(() => {
        callback(JSON.parse(localStorage.getItem('website')));
      });
    } else {
      callback(JSON.parse(localStorage.getItem('website')));
    }
  },

  updateWebsite(callback) {
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}`, {}, (response) => {
      if (!response.error) {
        localStorage.setItem('website', JSON.stringify(response.data));
        this.getWebsite(callback);
      } else {
        localStorage.removeItem('website');
      }
    });
  },

  getClaims(callback) {
    if (localStorage.getItem('claims') === null) {
      this.updateClaims((claims) => {
        callback(JSON.parse(claims));
      });
    } else {
      callback(JSON.parse(localStorage.getItem('claims')));
    }
  },

  updateClaims(callback) {
    request.get(`${apiUrl}/Claims`, {}, (response) => {
      if (!response.error) {
        localStorage.setItem('claims', JSON.stringify(response.data));
      } else {
        localStorage.removeItem('claims');
      }
      callback(localStorage.getItem('claims'));
    });
  },

  setWebsiteID(websiteID, callback) {
    localStorage.setItem('websiteID', websiteID);
    localStorage.removeItem('website');
    localStorage.removeItem('claims');
    callback();
  },

  websiteID: localStorage.getItem('websiteID'),

  getRole(callback) {
    this.getClaims((claims) => {
      if (claims.length !== 0) {
        const filtered = claims.filter((x) => x.Type === 'http://www.cybera.com.au/claims/roles');
        if (filtered[0] && filtered[0].Value) {
          return callback(filtered[0] && filtered[0].Value);
        }
      }
      return callback([]);
    });
  },

  getAccesses(userType = 'Merchant', callback) {
    if (localStorage.getItem('token')) {
      this.getClaims((claims) => {
        if (claims.length) {
          let filtered = [];
          if (userType === 'Merchant') {
            const userrole = claims.filter((x) => x.Type === `http://www.cybera.com.au/claims/websites/${localStorage.getItem('websiteID')}`);
            if (userrole.length > 0) {
              filtered = claims.filter((x) => x.Type === `http://www.cybera.com.au/claims/websites/${localStorage.getItem('websiteID')}/Accesses`);
              if (filtered[0]) {
                callback(filtered[0].Value);
              } else {
                callback([]);
              }
            } else {
              callback(false);
            }
          } else if (userType === 'Cybera') {
            const userrole = claims.filter((x) => x.Type === 'http://www.cybera.com.au/claims/cyberaroles');
            if (userrole.length > 0) {
              const CyberaRoleId = claims.filter((x) => x.Type === 'http://www.cybera.com.au/claims/cyberaroles')[0].Value;
              filtered = claims.filter((x) => x.Type === `http://www.cybera.com.au/claims/cyberaroles/${CyberaRoleId}/Accesses`);
              callback(filtered[0] && filtered[0].Value);
            } else {
              callback(false);
            }
          }
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  },

  isAdmin(callback) {
    if (localStorage.token) {
      this.getRole((role) => {
        if (role && role.length > 0 && role.indexOf('Cybera') !== -1) {
          callback(true);
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  },

  isMerchant(callback) {
    if (localStorage.token) {
      this.getRole((role) => {
        if (role && role.length > 0 && role.indexOf('Merchant') !== -1) {
          this.getWebsite((website) => {
            if (website.AccountStatus === 'Active') {
              callback(true);
            } else {
              callback(false);
            }
          });
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  },

  isMerchantOrCybera(callback) {
    if (localStorage.token) {
      this.getRole((role) => {
        if (role && role.length > 0 && (role.indexOf('Cybera') !== -1 || role.indexOf('Merchant') !== -1)) {
          callback(true);
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  },

  integrateFacebook(clientID, facebookToken, callback) {
    request.put(
      integrateFacebookAPI,
      { ClientId: clientID, Access_token: facebookToken },
      (response) => {
        if (!response.error) {
          callback(response);
        } else {
          callback({ error: response.error });
        }
      }
    );
  },

  updateToken(accessToken, callback) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', undefined);
    request.get(`${apiUrl}/User`, {}, (response) => {
      if (!response.error) {
        localStorage.setItem('user', JSON.stringify(response.data));
        if (callback() !== undefined) {
          callback();
        }
      }
    });
  },

  logout(callback) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('claims');
    localStorage.setItem('tempWebsiteID', localStorage.getItem('websiteID'));
    localStorage.removeItem('websiteID');
    localStorage.removeItem('website');

    if (callback() !== undefined) {
      callback(true);
    }
  },

  forgotPassword(email, callback) {
    request.get(
      forgotPasswordAPI(email),
      {},
      callback
    );
  },

  resetPassword(key, value, password, rePassword, callback) {
    request.put(
      resetPasswordAPI,
      {
        Key: key,
        Value: encodeURIComponent(value),
        Password: password,
        RePassword: rePassword,
      },
      callback
    );
  },

  loggedIn() {
    return !!localStorage.getItem('token');
  },

  register(username, password, callback) {
    request.post('/register', { username, password }, (response) => {
      if (response.registered === true) {
        this.login(username, password, callback);
      } else {
        callback(false, response.error);
      }
    });
  },
  onChange() {},
};

export default auth;
