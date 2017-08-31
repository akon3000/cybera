import {
  FACEBOOK_LOGIN,
} from './constants';

export function facebookLogin(clientID, facebookToken) {
  return {
    type: FACEBOOK_LOGIN,
    clientID,
    facebookToken,
  };
}
