export const getParameterByName = (name) => {
  const url = window.location.href;
  const n = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line
  const regex = new RegExp(`[?&]${n}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const formatDate = (dateString) => {
  const d = new Date(dateString);
  const yyyy = d.getFullYear().toString();
  const mm = (d.getMonth() + 101).toString().slice(-2);
  const dd = (d.getDate() + 100).toString().slice(-2);
  return `${dd}/${mm}/${yyyy}`;
};

export const AuDatetoNormal = (dateString) => {
  const d = new Date(dateString);
  const yyyy = d.getFullYear().toString();
  const mm = (d.getMonth() + 101).toString().slice(-2);
  const dd = (d.getDate() + 100).toString().slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};

// this function is only for report page fetch Odata, make the request date one day after
// input, because Odata seems return data only with less than input date
export const AuDatetoNormalDatePlusOne = (dateString) => {
  const d = new Date(dateString);
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear().toString();
  const mm = (d.getMonth() + 101).toString().slice(-2);
  const dd = (d.getDate() + 100).toString().slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};


export const saveAs = (response, filename) => {
  const uri = URL.createObjectURL(response);
  const link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link);
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link);
  } else {
    location.replace(uri);
  }
};

export const arrayContains = (a, obj) => {
  let i = a.length;
  while (i >= 0) {
    i -= 1;
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
};

export const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const stringToDate = (str) => {
  const tempArr = str.split('/');
  const date = new Date(tempArr[2], parseInt(tempArr[1], 10) - 1, tempArr[0]);
  return date;
};

export const bytesToMB = (bytes) => {
  const size = bytes * (1024 ** (-2));
  return size.toFixed(2);
};

export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 0);
  return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`;
};

export const prettyDate = (time) => {
  const date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '));
  const diff = (((new Date()).getTime() - date.getTime()) / 1000);
  const dayDiff = Math.floor(diff / 86400);
  let response = '';
  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return response;
  }

  if (dayDiff === 0) {
    if (diff < 60) response = 'just now';
    else if (diff < 120) response = '1 minute ago';
    else if (diff < 3600) response = `${Math.floor(diff / 60)} minutes ago`;
    else if (diff < 7200) response = '1 hour ago';
    else if (diff < 86400) response = `${Math.floor(diff / 3600)} hours ago`;
  } else if (dayDiff === 1) {
    response = 'Yesterday';
  } else if (dayDiff < 7) {
    response = `${dayDiff} days ago`;
  } else if (dayDiff < 31) {
    response = `${Math.ceil(dayDiff / 7)} weeks ago`;
  }

  return response;
};
