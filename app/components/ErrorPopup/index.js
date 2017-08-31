import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import IconClose from 'react-icons/lib/md/close';

import styles from './styles.css';
import IconError from './error_popup.png';

class ErrorPopup extends React.Component { // eslint-disable-line
  render() {
    return (
      <Dialog
        open={Boolean(true)}
        bodyClassName={styles.popupError}
        title={
          <div className={styles.title}>
            <img alt="Popup Error" src={IconError} />
            <button className={styles.popupClose} onClick={this.props.onClose}>
              <IconClose />
            </button>
          </div>
        }
      >
        <h3>Error</h3>
        <div className={styles.errMsg} data-automation-id={this.props['data-automation-id']}>{this.props.error}</div>
      </Dialog>);
  }
}

ErrorPopup.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
  'data-automation-id': PropTypes.string,
};

ErrorPopup.defaultProps = {
  'data-automation-id': '',
};

export default ErrorPopup;
