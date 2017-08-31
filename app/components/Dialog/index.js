import React from 'react';
import PropTypes from 'prop-types';
import IconClose from 'react-icons/lib/md/close';
import DialogMUI from 'material-ui/Dialog';

import styles from './styles.css';

function Dialog(props) {
  const headerDialog = props.title !== '' ? (
    <div className={styles.headerDialog}>
      <span className={styles.textTitle}>{props.title}</span>
      <button data-automation-id="btn-popup-close" className={styles.closeDialog} onClick={props.onClose}>
        <IconClose />
      </button>
    </div>
  ) : null;

  return (
    <DialogMUI
      {...props}
      modal={Boolean(true)}
      open={props.open}
      title={headerDialog}
      onRequestClose={props.onClose}
      contentClassName={styles.dialog}
      bodyClassName={`${styles.bodyDialog} ${props.bodyClassName}`}
      autoScrollBodyContent={props.autoScrollBodyContent}
      actionsContainerClassName={styles.actionsContianer}
      data-automation-id={props['data-automation-id']} // eslint-disable-line
    >
      <div className={styles.children}>
        {props.children}
      </div>
    </DialogMUI>);
}

Dialog.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  bodyClassName: PropTypes.string,
  autoScrollBodyContent: PropTypes.bool,
  'data-automation-id': PropTypes.string,
};

Dialog.defaultProps = {
  title: '',
  onClose: () => {},
  open: true,
  bodyClassName: '',
  autoScrollBodyContent: true,
  'data-automation-id': '',
};

export default Dialog;
