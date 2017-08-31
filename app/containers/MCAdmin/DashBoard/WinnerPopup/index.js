import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Dialog from '../../../../components/Dialog';
import Button from '../../../../components/Button';
import styles from './styles.css';
import icon from './winner-icon.png';

class WinnerPopup extends React.Component {

  componentDidMount() {
    window.dispatchEvent(new Event('resize'));
  }

  componentDidUpdate() {
    window.dispatchEvent(new Event('resize'));
  }

  render() {
    return (<Dialog
      data-automation-id="dialog-winner-popup"
      repositionOnUpdate={false}
      title="Congratulations"
      key="Congratulations"
      onClose={() => {
        this.props.history.push('/MCAdmin?GetStart=true');
      }}
      style={{ paddingTop: '10px' }}
      actions={[<Button data-automation-id="btn-ok" style={{ float: 'right' }} onClick={() => { this.props.history.push('/MCAdmin?GetStart=true'); }}>OK</Button>]}
    >
      <p className={styles.body} data-automation-id="popup-signup-congratulations">
        {"You're all done"}<br />
        <img src={icon} alt="presentation" data-automation-id="image-signup-congratulations" />
      </p>
    </Dialog>);
  }
}

WinnerPopup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(WinnerPopup);
