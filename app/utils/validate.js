import message from '../Message';

const validate = {
  isEmail: (value) => {
    if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(value)) {
      return true;
    }
    return false;
  },

  isPassword: (value) => {
    if (/^(?=.*[A-Za-z!@#$%^&*?])(?=.*\d)[A-Za-z!@#$%^&*?\d]{6,12}$/i.test(value)) {
      return true;
    }
    return false;
  },

  isDiscountCode: (value) => {
    if (/^[A-Za-z0-9 ]{0,20}$/i.test(value)) {
      return true;
    }
    return false;
  },

  isDollarAmount: (value) => {
    if (/^\d{0,7}(\.\d{1,2})?$/i.test(value)) {
      return true;
    }
    return false;
  },

  isCopyright: (value) => {
    if (/^[a-zA-Z0-9@.-]+$/.test(value)) {
      return true;
    }
    return 'Only special characters "@", "-" and "." are allowed';
  },

  isValidLength: (value, maxLength, fieldName) => {
    if (value.length > maxLength) {
      return `${fieldName} cannot be longer than ${maxLength} characters`;
    }
    return true;
  },

  isValidCharacters: (value, charactersAllowed, isAllowSpace = false) => {
    const specialCharacterReg = new RegExp(`^[a-zA-Z0-9${charactersAllowed}${isAllowSpace ? ' ' : ''}]+$`, 'i');
    let count = 1;
    let characterLinks = '';
    const charactersLength = charactersAllowed.length;
    charactersAllowed.split('').forEach((character) => {
      if (count < charactersLength - 1) {
        characterLinks = `${characterLinks}"${character}", `;
      } else if (count === charactersLength - 1) {
        characterLinks = `${characterLinks}"${character}" and `;
      } else if (count === charactersLength) {
        characterLinks = `${characterLinks}"${character}"`;
      }
      count += 1;
    });
    if (specialCharacterReg.test(value)) {
      return true;
    }
    return `Only special characters ${characterLinks} ${charactersLength > 1 ? 'are' : ''} allowed`;
  },

  isName: (value, charactersAllowed) => {
    const specialCharacterReg = new RegExp(`^[a-zA-Z${charactersAllowed}]+$`, 'i');
    let count = 1;
    let characterLinks = '';
    const charactersLength = charactersAllowed.length;
    charactersAllowed.split('').forEach((character) => {
      if (count < charactersLength - 1) {
        characterLinks = `${characterLinks}"${character}", `;
      } else if (count === charactersLength - 1) {
        characterLinks = `${characterLinks}"${character}" and `;
      } else if (count === charactersLength) {
        characterLinks = `${characterLinks}"${character}"`;
      }
      count += 1;
    });
    if (specialCharacterReg.test(value)) {
      return true;
    }
    return `Only special characters ${characterLinks} are allowed`;
  },

  isNameWithNumbers: (value, chatactersAllowed, allowMultipleWords = false) => {
    const specialCharacterReg = new RegExp(`^[a-zA-Z0-9${chatactersAllowed}${allowMultipleWords ? ' ' : ''}]+$`, 'i');
    const characterswithSpace = chatactersAllowed.split('').join('" or "');
    if (specialCharacterReg.test(value)) {
      return true;
    }
    return `Only special characters "${characterswithSpace}" are allowed`;
  },

  isWebsiteName: (value) => {
    if (/^[A-Za-z0-9-_ ]+$/i.test(value)) {
      return true;
    }
    return 'Only special characters "-" or "_" are allowed';
  },

  isRoleName: (value) => {
    if (/^[A-Za-z0-9]+$/i.test(value)) {
      return true;
    }
    return 'Only numbers and characters are allowed';
  },

  isNumeric: (value, maxLength = null, minLength = null) => {
    const isNumber = !isNaN(parseFloat(value)) && isFinite(value);

    if (!isNumber) {
      return message.error.ONLY_NUM;
    }

    if (maxLength != null && minLength != null &&
        !(value.length >= minLength && value.length <= maxLength)
    ) {
      return `This field must be between ${minLength} to ${maxLength} numbers`;
    }

    if (maxLength != null && value.length > maxLength) {
      return `This field should have ${maxLength} numbers or fewer`;
    }

    if (minLength != null && value.length < minLength) {
      return `This field should have ${minLength} numbers or more`;
    }

    return true;
  },

  notNumeric(value) {
    if (!/^[^\d]+$/.test(value)) return message.error.ONLY_CHAR;
    return true;
  },

  notCharacter(value) {
    if (!/^[^a-zA-Z]+$/.test(value)) return message.error.ONLY_CHAR;
    return true;
  },

  notSpecialChar(value) {
    if (!/^[a-zA-z0-9\s]+$/.test(value)) return message.error.ALPHANUMERIC;
    return true;
  },

  matchName(value) {
    if (!/^[^\d]+$/.test(value)) return message.error.ONLY_CHAR;
    if (!/^[a-zA-Z.'\-\s]+$/.test(value)) return message.format('special_char', ['-', "'", '.']);
    return true;
  },

  matchAddress(value) {
    if (!/^[a-zA-Z0-9\s.-]+$/.test(value)) return message.format('special_char', ['-', '.']);
    return true;
  },

  matchPlace(value) {
    if (!/^[a-zA-Z-]+$/.test(value)) return message.format('special_char', ['-']);
    return true;
  },

  matchDateOfBirth(value) {
    /**
     * Set variable Date
     */
    if (value.length < 10) return message.error.NOT_VALID_DOB;
    const userDate = value.split('/');
    const userDay = parseInt(userDate[0], 10);
    const userMonth = parseInt(userDate[1], 10) - 1;
    const userYear = parseInt(userDate[2], 10);

    const dateAllow = new Date();
    dateAllow.setFullYear(dateAllow.getFullYear() - 18);
    const birthday = new Date(userYear, userMonth, userDay);
    const dayMonth = new Date(userYear, userMonth + 1, 0); // <-- get day in Month and Year

    /**
     * Start validate
     */
    if (userDay > dayMonth.getDate() || userDay < 1) return message.error.NOT_VALID_DOB;
    if (userMonth < 0 || userMonth > 11) return message.error.NOT_VALID_DOB;
    if (birthday.getTime() > dateAllow.getTime()) return message.error.DOB_INCORRECT;
    return true;
  },

  matchExpiry(value) {
    return /^[\s0-9\/]+$/.test(value); // eslint-disable-line
  },

  matchContactNumber(value) {
    if (!/^[\s0-9]+$/.test(value)) return message.error.ONLY_NUM; // eslint-disable-line
    return true;
  },

  matchCard(value) {
    return /^[0-9]+$/.test(value); // eslint-disable-line
  },

};

export default validate;
