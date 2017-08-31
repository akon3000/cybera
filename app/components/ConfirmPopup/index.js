import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import IconClose from 'react-icons/lib/md/close';

import Button from '../Button';
import styles from './styles.css';
import IconConfirm from './confirm_popup.png';

class ConfirmPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Dialog
        open={Boolean(true)}
        bodyClassName={styles.popupConfirm}
        actionsContainerClassName={styles.actionsContianer}
        title={
          <div className={styles.title}>
            <img alt="Popup Confirm" src={IconConfirm} />
            <button className={styles.popupClose} onClick={this.props.onClose}>
              <IconClose />
            </button>
          </div>
        }
        actions={this.props.actions || [
          <Button key="btn-yes" data-automation-id="btn-confirm-yes" onClick={this.props.onConfirm}>Yes</Button>,
          <Button
            key="btn-no"
            data-automation-id="btn-confirm-no"
            btnStyle="negative"
            onClick={() => {
              if (typeof this.onCancel !== 'undefined') {
                this.props.onCancel();
              } else {
                this.props.onClose();
              }
            }}
          >No</Button>,
        ]}
      >
        <div className={styles.confirmMsg} data-automation-id={this.props['data-automation-id']}>{this.props.children}</div>
      </Dialog>
    );
  }
}

ConfirmPopup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  actions: PropTypes.array,
  'data-automation-id': PropTypes.string,
};

ConfirmPopup.defaultProps = {
  'data-automation-id': '',
  actions: undefined,
  onCancel: undefined,
  onConfirm: undefined,
};

export default ConfirmPopup;
