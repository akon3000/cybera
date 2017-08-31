import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Dialog from '../../../../components/Dialog';
import Button from '../../../../components/Button';
import styles from './styles.css';

const GetStart = ({ history }) => (<Dialog
  data-automation-id="dialog-merchant-getstart-popup"
  title="Let's get started..."
  key="LetGetStarted"
  boxStyle={{ backgroundColor: '#FFF', height: 'auto' }}
  className={styles.popup}
  onClose={() => {
    history.push('/MCAdmin');
  }}
  actions={[<Button data-automation-id="btn-link-to-mcadmin" onClick={() => { history.push('/MCAdmin'); }}>View Tutorial</Button>]}
>
  <p className={styles.body} data-automation-id="popup-let-started">
    {'We have created some helpful tutorials to help you navigate through each section of your website. Click the "View Tutorial" link below to begin, help is never far away if you get stuck, simply click the tutorial button in the top right hand corner of each page.'}
  </p>
</Dialog>);

GetStart.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(GetStart);
