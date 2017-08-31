import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../../../components/Button';
import styles from './styles.css';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import auth from '../../../../utils/auth';
import Loading from '../../../../components/Loading';
import ErrorBox from '../../../../components/ErrorBox';
import ConfirmPopup from '../../../../components/ConfirmPopup';
import SuccessPopup from '../../../../components/SuccessPopup';

class DisableAutoRenewal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasPassword: false,
      error: false,
      success: false,
    };
  }

  componentDidMount() {
    auth.getUser((user) => {
      this.setState({ user });
    });
  }

  submit() {
    this.setState({ isLoading: true });
    request.put(
      `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/CancelAutoRenewSubscription`,
      {},
      (response) => {
        if (response.error) {
          this.setState({ error: response.error, isLoading: false });
        } else {
          this.setState({ isLoading: false, success: true });
        }
      });
  }

  render() {
    const actions = [
      <Button
        data-automation-id="btn-merchant-submit-disableautorenewal"
        onClick={() => {
          this.submit();
        }}
        disabled={this.state.user === undefined}
      >Yes</Button>,
      <Button btnStyle="negative" onClick={() => this.props.onClose()}>No</Button>,
    ];

    if (this.state.success) {
      return (
        <SuccessPopup
          data-automation-id="dialog-merchant-disableautorenewal"
          onClose={() => this.props.onClose()}
        >
          <h3>Disable Auto Renewal</h3>
          <div>Auto renewal option is disabled.</div>
        </SuccessPopup>
      );
    }

    return (
      <ConfirmPopup
        data-automation-id="dialog-merchant-disableautorenewal"
        actions={actions}
        onClose={() => this.props.onClose()}
      >
        { this.state.error &&
          <div className={styles.errorBox}>
            <ErrorBox
              data-automation-id="error-merchant-disableautorenewal"
              error={this.state.error}
              onClose={() => this.setState({ error: false })}
            />
          </div>
        }
        <h3>Disable Auto Renewal</h3>
        <div>Are you sure to disable the auto renewal option?</div>
        { this.state.isLoading && <Loading /> }
      </ConfirmPopup>
    );
  }
}

DisableAutoRenewal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default DisableAutoRenewal;
