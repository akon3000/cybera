import React from 'react';
import PropTypes from 'prop-types';
import MUIAutoComplete from 'material-ui/AutoComplete';
import IconLoading from 'react-icons/lib/fa/spinner';

import styles from './styles.css';

function AutoComplete (props) { // eslint-disable-line
  const { key,input, label, type, hintText, icon, searchText, onUpdateInput, isLoading, dataSourceConfig, onNewRequest, dataSource, meta: { touched, error }} = props; // eslint-disable-line
  return (
    <div className={`${styles.container}`} data-automation-id={props['data-automation-id']}>
      <label htmlFor={input.name}>{label}</label>
      <div className={styles.muiContainer}>
        <MUIAutoComplete
          className={styles.textField}
          errorText={touched && error && <span data-automation-id="error">{error}</span>}
          {...input}
          type={type}
          hintText={hintText}
          dataSource={!isLoading ? dataSource : []}
          onUpdateInput={onUpdateInput}
          dataSourceConfig={dataSourceConfig}
          onNewRequest={onNewRequest}
          searchText={searchText}
          filter={() => true}
        />
        { isLoading && <IconLoading className={styles.loading} /> }
      </div>
    </div>
  );
}

AutoComplete.propTypes = {
  'data-automation-id': PropTypes.string,
};

AutoComplete.defaultProps = {
  'data-automation-id': '',
};

export default AutoComplete;
