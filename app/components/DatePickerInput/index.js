import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import areIntlLocalesSupported from 'intl-locales-supported';

import styles from './styles.css';

function DatePickerInput ({ input, label, hintText, icon, meta: { touched, error }, maxDate, minDate}) { // eslint-disable-line
  const dateValue = (input.value) ? new Date(input.value) : null;
  let DateTimeFormat;
  if (areIntlLocalesSupported(['en-AU'])) {
    DateTimeFormat = Intl.DateTimeFormat;
  } else {
    const IntlPolyfill = require('intl'); // eslint-disable-line
    DateTimeFormat = IntlPolyfill.DateTimeFormat;
    require('intl/locale-data/jsonp/en-AU'); // eslint-disable-line
  }
  return (
    <div className={`${styles.container}`}>
      {label && <label htmlFor={input.name}>{label}</label> }
      {icon}
      <DatePicker
        name={input.name}
        className={`${styles.textField} ${icon && styles.iconField}`}
        container="inline"
        cancelLabel={<span className={styles.cancelLabel}>cancel</span>}
        errorText={touched && error}
        onChange={(event, value) => {
          input.onChange(value);
        }}
        DateTimeFormat={DateTimeFormat}
        firstDayOfWeek={0}
        locale="en-AU"
        autoOk={Boolean(true)}
        maxDate={maxDate}
        minDate={minDate}
        value={dateValue}
        hintText={hintText}
      />
    </div>
  );
}

export default DatePickerInput;
