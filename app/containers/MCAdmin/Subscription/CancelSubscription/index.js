import React from 'react';
import PropTypes from 'prop-types';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { withRouter } from 'react-router-dom';

import Button from '../../../../components/Button';
import styles from './styles.css';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import auth from '../../../../utils/auth';
import Dialog from '../../../../components/Dialog';
import Loading from '../../../../components/Loading';
import ErrorBox from '../../../../components/ErrorBox';
import ConfirmPopup from '../../../../components/ConfirmPopup';
import SuccessPopup from '../../../../components/SuccessPopup';
import Message from '../../../../Message';
import validate from '../../../../utils/validate';

class CancelSubscription extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showPassword: false,
      hasPassword: false,
      showReasons: false,
      selectedReason: '',
      otherReason: '',
      reasonChosen: false,
      error: false,
      CancelSubscriptionReasons: [],
    };
  }

  componentDidMount() {
    auth.getUser((user) => {
      this.setState({ user });
    });
    request.get(`${apiUrl}/CancelSubscriptionReason`, {}, (response) => {
      if (response.data) {
        this.setState({ CancelSubscriptionReasons: response.data.Items });
      }
    });
  }

  onClose() {
    if (this.state.success) {
      this.setState({ isLoading: true });
      auth.logout(() => {
        this.props.history.push('/');
      });
    } else {
      this.props.onClose();
    }
  }

  checkReasonInput() {
    if (this.state.selectedReason !== '') {
      if (this.state.selectedReason === 0) {
        if (this.state.otherReason !== '' && this.state.otherReason.length <= 250) {
          this.setState({
            reasonChosen: true,
            error: false,
            showReasons: false,
          }, () => {
            if (!this.state.showPassword && this.state.user.HasPassword) {
              this.setState({ showPassword: true });
            } else {
              this.setState({ isLoading: true }, () => this.submit());
            }
          });
        } else if (this.state.otherReason === '') {
          this.setState({
            reasonChosen: false,
            error: 'Please specify a reason for unsubscribing',
          });
        } else if (this.state.otherReason.length > 250) {
          this.setState({
            reasonChosen: false,
            error: 'Reason cannot be longer than 250 characters',
          });
        }
      } else {
        this.setState({
          reasonChosen: true,
          error: false,
        }, () => {
          if (!this.state.showPassword && this.state.user.HasPassword) {
            this.setState({ showPassword: true, showReasons: false });
          } else {
            this.setState({ isLoading: true }, () => this.submit());
          }
        });
      }
    } else {
      this.setState({
        reasonChosen: false,
        error: 'Please specify a reason for unsubscribing',
      });
    }
  }

  submit() {
    let ReasonText = '';
    this.state.CancelSubscriptionReasons.forEach((value) => {
      if (value.Id === this.state.selectedReason) {
        ReasonText = value.Name;
      }
    });
    if (ReasonText === '') {
      ReasonText = this.state.otherReason;
    }

    if (!this.state.user.HasPassword) {
      request.put(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/CancelSubscription`,
        {
          CancelReason: ReasonText,
        },
        (response) => {
          if (response.error) {
            this.setState({ error: response.error, isLoading: false });
          } else {
            this.setState({ showPassword: false, showReasons: false, isLoading: false, success: true, otherReason: '' });
          }
        });
    } else {
      const password = this.passwordInput.value;
      if (password === '') {
        this.setState({ error: 'Please enter password' });
      } else if (!validate.isPassword(password)) {
        this.setState({ error: Message.error.PASSWORD_INCORRECT_FORMAT });
      } else {
        this.setState({ isLoading: true });
        request.put(
          `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/CancelSubscription`,
          {
            CancelReason: ReasonText,
            Password: password,
          },
          (response) => {
            if (response.error) {
              this.setState({ error: response.error, isLoading: false });
            } else {
              this.setState({ showPassword: false, isLoading: false, success: true, otherReason: '' });
            }
          });
      }
    }
  }

  render() {
    let actions = [
      <Button
        key="btn-yes"
        data-automation-id="btn-merchant-show-cancelreason"
        onClick={() => this.setState({ showReasons: true })}
        disabled={this.state.user === undefined}
      >Yes</Button>,
      <Button key="btn-no" btnStyle="negative" onClick={() => this.onClose()}>No</Button>,
    ];

    if (this.state.showReasons) {
      actions = [
        <Button
          key="btn-next-submit"
          data-automation-id="btn-merchant-show-password"
          type="button"
          onClick={() => {
            this.checkReasonInput();
          }}
          disabled={this.state.user === undefined}
        >{this.state.user.HasPassword ? 'Next' : 'Submit'}</Button>,
      ];
    }

    if (this.state.showPassword) {
      actions = [
        <Button
          key="btn-submit"
          data-automation-id="btn-merchant-cancel-submit"
          type="button"
          onClick={() => {
            this.submit();
          }}
          disabled={this.state.user === undefined}
        >Submit</Button>,
      ];
    }

    // if (this.state.success) {
    //   actions = [
    //     <Button
    //       data-automation-id="btn-merchant-cancel-success"
    //       onClick={() => {
    //         this.setState({ isLoading: true });
    //         auth.logout(() => {
    //           this.props.history.push('/');
    //         });
    //       }}
    //       disabled={this.state.user === undefined}
    //     >Ok</Button>,
    //   ];
    // }

    const cancelReasons = [];
    this.state.CancelSubscriptionReasons.forEach((value) => {
      cancelReasons.push(<RadioButton key={value.Id} value={value.Id} label={value.Name} />);
    });
    cancelReasons.push(<RadioButton key={'reason_other'} value={0} label="Other" />);

    if (this.state.showReasons) {
      return (
        <Dialog
          data-automation-id="dialog-merchant-cancel-popup"
          title="Cancel Subscription"
          onClose={() => { this.onClose(); }}
          actions={actions}
        >
          <div className={styles.cancelReasonsContanier}>
            { this.state.error &&
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <ErrorBox
                  error={this.state.error}
                  onClose={() => { this.setState({ error: false }); }}
                />
              </div>
            }
            <label htmlFor="unsubscribeReasons">Why are you unsubscribing?</label>
            <br style={{ display: 'block' }} />
            <br style={{ display: 'block' }} />
            <RadioButtonGroup
              data-automation-id="radio-merchant-cancel-reasons"
              name="unsubscribeReasons"
              component={RadioButtonGroup}
              onChange={(event, value) => {
                this.setState({
                  selectedReason: value,
                });
              }}
              value={0}
            >
              {cancelReasons}
            </RadioButtonGroup>
            <textarea
              data-automation-id="textarea-merchant-cancel-reason"
              name="otherReason"
              disabled={this.state.selectedReason !== 0}
              value={this.state.otherReason}
              onChange={(event) => {
                this.setState({ otherReason: event.target.value });
              }}
            />
          </div>
          { this.state.isLoading && <Loading /> }
        </Dialog>
      );
    }

    if (this.state.showPassword) {
      return (
        <Dialog
          data-automation-id="dialog-merchant-cancel-popup"
          title="Cancel Subscription"
          onClose={() => { this.onClose(); }}
          actions={actions}
        >
          <div className={styles.showPassword}>
            <div>
              {this.state.error &&
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <ErrorBox
                    error={this.state.error}
                    onClose={() => { this.setState({ error: false }); }}
                  />
                </div>
              }
              <span>Please enter password</span>
              <input
                data-automation-id="input-merchant-cancel-password"
                ref={(node) => { this.passwordInput = node; }}
                type="password"
              />
            </div>
          </div>
          { this.state.isLoading && <Loading /> }
        </Dialog>
      );
    }

    if (this.state.success) {
      return (
        <SuccessPopup
          data-automation-id="dialog-merchant-cancel-popup"
          onClose={() => { this.onClose(); }}
        >
          <h3>You have been successful</h3>
          <div>Merchant subscription cancelled</div>
        </SuccessPopup>
      );
    }

    return (
      <ConfirmPopup
        data-automation-id="dialog-merchant-cancel-popup"
        onClose={() => this.onClose()}
        onConfirm={() => this.setState({ showReasons: true })}
        actions={actions}
      >
        <h3>Cancel Subscription</h3>
        { this.state.error &&
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <ErrorBox
              error={this.state.error}
              onClose={() => { this.setState({ error: false }); }}
            />
          </div>
        }
        Cancel the subscription will also disable your website.
        Are you sure to cancel your subscription?
      </ConfirmPopup>
    );

    // return (
    //   <div>
    //     <Dialog
    //       data-automation-id="dialog-merchant-cancel-popup"
    //       title="Cancel Subscription"
    //       onClose={() => { this.onClose(); }}
    //       actions={actions}
    //     >
    //       {!this.state.showPassword && !this.state.success && !this.state.showReasons &&
    //         <div className={styles.cancelPopup}>
    //           {this.state.error &&
    //             <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    //               <ErrorBox
    //                 error={this.state.error}
    //                 onClose={() => { this.setState({ error: false }); }}
    //               />
    //             </div>
    //           }
    //           Cancel the subscription will also disable your website,
    //           are you sure to cancel subscription?
    //         </div>}
    //       {this.state.showReasons &&
    //         <div className={styles.cancelReasonsContanier}>
    //           {this.state.error &&
    //             <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    //               <ErrorBox
    //                 error={this.state.error}
    //                 onClose={() => { this.setState({ error: false }); }}
    //               />
    //             </div>
    //           }
    //           <label htmlFor="unsubscribeReasons">Why are you unsubscribing?</label>
    //           <br style={{ display: 'block' }} />
    //           <br style={{ display: 'block' }} />
    //           <RadioButtonGroup
    //             data-automation-id="radio-merchant-cancel-reasons"
    //             name="unsubscribeReasons"
    //             component={RadioButtonGroup}
    //             onChange={(event, value) => {
    //               this.setState({
    //                 selectedReason: value,
    //               });
    //             }}
    //             value={0}
    //           >
    //             {cancelReasons}
    //           </RadioButtonGroup>
    //           <textarea
    //             data-automation-id="textarea-merchant-cancel-reason"
    //             name="otherReason"
    //             disabled={this.state.selectedReason !== 0}
    //             value={this.state.otherReason}
    //             onChange={(event) => {
    //               this.setState({ otherReason: event.target.value });
    //             }}
    //           />
    //         </div>
    //       }
    //       {this.state.showPassword &&
    //         <div className={styles.showPassword}>
    //           <div>
    //             {this.state.error &&
    //               <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    //                 <ErrorBox
    //                   error={this.state.error}
    //                   onClose={() => { this.setState({ error: false }); }}
    //                 />
    //               </div>
    //             }
    //             <span>Please enter password</span>
    //             <input
    //               data-automation-id="input-merchant-cancel-password"
    //               ref={(node) => { this.passwordInput = node; }}
    //               type="password"
    //             />
    //           </div>
    //         </div>}
    //       {this.state.success &&
    //         <div className={styles.success}>Merchant subscription cancelled</div>
    //       }
    //       {this.state.isLoading && <Loading />}
    //     </Dialog>
    //   </div>
    // );
  }
}

CancelSubscription.propTypes = {
  onClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(CancelSubscription);
