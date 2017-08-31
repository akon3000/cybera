import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import IconClose from 'react-icons/lib/md/close';

import styles from './styles.css';
import IconSuccess from './success_popup.png';

class SuccessPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Dialog
        open={Boolean(true)}
        bodyClassName={styles.popupSuccess}
        title={
          <div className={styles.title}>
            <img alt="Popup Success" src={IconSuccess} />
            <button className={styles.popupClose} onClick={this.props.onClose}>
              <IconClose />
            </button>
          </div>
        }
      >
        <div className={styles.successMsg} data-automation-id={this.props['data-automation-id']}>{this.props.children}</div>
      </Dialog>
    );
  }
}

SuccessPopup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
  'data-automation-id': PropTypes.string,
};

SuccessPopup.defaultProps = {
  'data-automation-id': '',
};

export default SuccessPopup;
