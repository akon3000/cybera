/**
 * Encode object to url parameters
 *
 * @param      {Object} paramsObj The object needs to encode as url parameters
 * @return     {String} Encoded url parameters
 */
export default (paramsObj) => {
  let str = '';
  for (const key in paramsObj) { // eslint-disable-line
    if (str !== '') {
      str += '&';
    }

    if (Object.prototype.toString.call(paramsObj[key]) === '[object Array]') {
      for (let i = 0; i < paramsObj[key].length; i += 1) {
        str += `${key}=${encodeURIComponent(paramsObj[key][i])}&`;
      }
    } else {
      str += `${key}=${encodeURIComponent(paramsObj[key])}`;
    }
  }
  return str.trim();
};
