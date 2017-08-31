export const decode = (encodedStr) => {
  const elem = document.createElement('textarea');
  elem.innerHTML = encodedStr;

  return elem.value;
};
