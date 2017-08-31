import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconClose from 'react-icons/lib/md/close';
import DialogMUI from 'material-ui/Dialog';

import styles from './styles.css';

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    if (this.props.handle) {
      this.props.handle();
    }
  }

  render() {
    const headerDialog = this.props.title !== '' ? (
      <div className={styles.headerDialog}>
        <span className={styles.textTitle}>{this.props.title}</span>
        <button className={styles.closeDialog} onClick={this.props.onClose}>
          <IconClose />
        </button>
      </div>
    ) : null;

    return (
      <DialogMUI
        {...this.props}
        modal={Boolean(false)}
        open={this.props.open}
        onRequestClose={this.props.onClose}
        contentClassName={styles.dialog}
        bodyClassName={`${styles.bodyDialog} ${this.props.bodyCustom}`}
        actionsContainerClassName={styles.actionsContianer}
        title={headerDialog}
        overlayClassName={styles.overlay}
      >
        <div className={styles.children}>
          {this.props.children}
        </div>
      </DialogMUI>
    );
  }
}

Dialog.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  bodyCustom: PropTypes.string,
  handle: PropTypes.func,
};

Dialog.defaultProps = {
  title: '',
  onClose: () => {},
  open: true,
  bodyCustom: '',
  handle: null,
};

export default Dialog;
