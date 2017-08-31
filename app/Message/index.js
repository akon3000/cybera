const message = {
  error: {
    INPUT_REQUIRED: 'This field is required.',
    NOT_VALID_PAYMENT_RANGE: 'Please enter valid amount. Note: maximum 7 numbers allowed with 2 decimal places.',
    NOT_VALID_EMAIL: 'Please enter valid email address',
    NOT_VALID_DOB: 'Please enter valid date of birth',
    DOB_INCORRECT: 'You must be at least 18 years old to be a subscriber',
    NOT_AVAILABLE: 'Not available',
    AUTH_FAIL: 'Oops! You entered an invalid email address or password. Please try again.',
    PASSWORD_INCORRECT_FORMAT: 'Please enter password with 6 - 12 characters and at least one number',
    DISCOUNT_CODE_INCORRECT: 'Please enter a combination of Maximum 20 characters and numbers',
    DOLLAR_AMOUNT_INCORRECT: 'Please enter valid amount. Note: maximum 7 numbers allowed with 2 decimal places',
    PASSWORD_NOT_MATCH: 'Password and confirm password doesn’t match',
    STARTDATE_INVALID: 'Start date can not be latter than end date',
    ENDDATE_INVALID: 'End date can not be earlier than start date',
    ONLY_CHAR: 'Please enter characters only',
    ONLY_NUM: 'Please enter numbers only',
    ALPHANUMERIC: 'No special character allowed',
    PAYMENT_RANGE_FROM: 'From range cannot be bigger than to range',
    PAYMENT_RANGE_TO: 'To range cannot be smaller than from range',
  },
  format(event, value = '') {
    const isSpecialChar = () => {
      if (!Array.isArray(value)) return '';
      const length = value.length - 1;
      let str = '';
      value.forEach((x, idx) => {
        if (idx < length) {
          str += `"${x}"${(idx + 1) === length ? '' : ','} `;
        } else {
          str += `and "${x}"`;
        }
      });
      return value.length === 1 ? `${str} is allowed` : `${str} are allowed`;
    };
    return {
      require_enter: `Please enter ${value}`,
      require_choose: `Please choose ${value}`,
      require_select: `Please select ${value}`,
      not_valid: `Please enter valid ${value}`,
      not_available: `This ${value} is not available`,
      special_char: `Only special characters ${isSpecialChar()}`,
    }[event];
  },
};

export default message;
