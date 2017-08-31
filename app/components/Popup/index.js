import React from 'react';
import PropTypes from 'prop-types';
import IconClose from 'react-icons/lib/md/close';

import styles from './styles.css';

function Popup(props) {
  let titleBox = null;
  if (props.title !== undefined) {
    let closeButton = null;
    closeButton = (<button className={styles.closeButton} onClick={props.onClose}><IconClose /></button>);
    titleBox = <div key="Popup_Title" className={styles.titleBox}>{props.title}{closeButton}</div>;
  }

  return (
    <div className={styles.background} data-automation-id={props['data-automation-id']}>
      <div className={styles.box} style={props.boxStyle}>
        {titleBox}
        {props.children}
      </div>
    </div>);
}

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  boxStyle: PropTypes.object,
  'data-automation-id': PropTypes.string,
};

Popup.defaultProps = {
  title: null,
  boxStyle: null,
  'data-automation-id': '',
};

export default Popup;
