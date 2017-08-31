import React from 'react';
import PropTypes from 'prop-types';
import IconShop from 'react-icons/lib/md/store';
import IconMail from 'react-icons/lib/fa/at';
import IconKey from 'react-icons/lib/md/lock-outline';
import IconFB from 'react-icons/lib/fa/facebook';
import IconPencil from 'react-icons/lib/go/pencil';
import IconLoading from 'react-icons/lib/fa/spinner';
import Checkbox from 'material-ui/Checkbox';
import IconClose from 'react-icons/lib/md/close';

import styles from './styles.css';
import { InputWithIcon } from '../../../../components/InputWithIcon';
import Loading from '../../../../components/Loading';
import message from '../../../../../app/Message';
import { facebookApi } from '../../../../config';
import objectToParams from '../../../../utils/objectToParams';
import validate from '../../../../utils/validate';
import Button from '../../../../../app/components/Button';
import ErrorBox from '../../../../components/ErrorBox';

export class RegisterPopup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditingSubDomain: false,
      inputShopNameValidateError: true,
      inputEmailValidateError: true,
      inputPasswordValidateError: true,
      inputSubDomainValidateError: true,
      isValidating: false,
      loading: false,
      isCheckingShopName: false,
      isCheckingSubDomain: false,
      isCheckingEmail: false,
      shownTemplate: props.shownTemplate,
      selectedPlan: props.selectedPlan,
      isReceiveCyberaNewsLetter: true,
      isAccept: false,
      error: props.error,
      isShowTerm: false,
      shopname: '',
    };
  }

  componentDidMount() {
    const { appId, xfbml, cookie, version, autoLoad, language } = facebookApi;

    let fbRoot = document.getElementById('fb-root');

    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';

      document.body.appendChild(fbRoot);
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${version}`,
        appId,
        xfbml,
        cookie,
      });

      if (autoLoad || window.location.search.includes('facebookdirect')) {
        // window.FB.getLoginStatus(this.checkLoginAfterRefresh);
      }
    };
    // Load the SDK asynchronously
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = `//connect.facebook.net/${language}/all.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  componentWillReceiveProps(nextProps) {
    /** Shopname / Websitename api error */
    if (nextProps.checkShopNameError !== this.props.checkShopNameError) {
      this.setState({ inputShopNameValidateError: nextProps.checkShopNameError });
    }
    /** SubDomain api error */
    if (nextProps.checkSubDomainError !== this.props.checkSubDomainError) {
      this.setState({ inputSubDomainValidateError: nextProps.checkSubDomainError });
    }
    /** E-mail api error */
    if (nextProps.isEmailAvailable !== this.props.isEmailAvailable) {
      this.setState({ inputEmailValidateError: nextProps.isEmailAvailable });
    }
  }

  componentDidUpdate() {
    if (this.state.isEditingSubDomain) {
      this.inputSubDomain.focus();
      if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
        const range = document.createRange();
        range.selectNodeContents(this.inputSubDomain);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (typeof document.body.createTextRange !== 'undefined') {
        const textRange = document.body.createTextRange();
        textRange.moveToElementText(this.inputSubDomain);
        textRange.collapse(false);
        textRange.select();
      }
    }
  }

  onClickSignUp() {
    if (!this.state.loading) {
      this.setState({
        inputShopNameValidateError: this.props.checkShopNameError !== true ? this.props.checkShopNameError : this.validateShopName(this.inputShopName.value),
        inputSubDomainValidateError: this.props.checkSubDomainError !== true ? this.props.checkSubDomainError : this.validateSubDomain(this.inputSubDomain.textContent),
        inputEmailValidateError: this.props.isEmailAvailable !== true ? this.props.isEmailAvailable : this.validateEmail(this.inputEmail.value),
        inputPasswordValidateError: this.validatePassword(this.inputPassword.value),
        isValidating: true,
      }, () => {
        if (this.state.inputShopNameValidateError === true
            && this.state.inputSubDomainValidateError === true
            && this.state.inputEmailValidateError === true
            && this.state.inputPasswordValidateError === true) {
          if (!this.state.isAccept) {
            this.setState({ error: 'Please accept terms and conditions' });
          } else {
            this.setState({ loading: true }, () => {
              this.props.onSignUp({
                email: this.inputEmail.value,
                password: this.inputPassword.value,
                shopName: this.inputShopName.value,
                subDomain: this.inputSubDomain.textContent,
                shownTemplate: this.state.shownTemplate,
                selectedPlan: this.state.selectedPlan,
                isReceiveCyberaNewsLetter: this.state.isReceiveCyberaNewsLetter,
              }, () => {
                this.setState({ loading: false });
              });
            });
          }
        }
      });
    }
  }

  onSubDomainChange(targetValue) {
    if (targetValue) {
      this.setState({
        subDomain: this.subDomainEncode(targetValue),
        isCheckingSubDomain: true,
      });
      clearTimeout(this.typingSubDomainTimer);
      this.typingSubDomainTimer = setTimeout((value = this.state.subDomain) => {
        this.props.onSubDomainChange(value);
        this.setState({ isCheckingShopName: false, isCheckingSubDomain: false });
      }, 1000);
    }
  }

  onClickSignUpWithFacebook() {
    this.setState({
      inputShopNameValidateError: this.validateShopName(this.inputShopName.value),
      inputEmailValidateError: this.validateEmail(this.inputEmail.value),
      inputPasswordValidateError: true,
      isValidating: true,
    }, () => {
      if (this.state.inputShopNameValidateError === true
        && this.state.inputEmailValidateError === true) {
        if (!this.state.isAccept) {
          this.setState({ error: 'Please accept terms and conditions' });
        } else {
          this.setState({ loading: true });
          this.showFacebookPopup();
        }
      }
    });
  }

  showFacebookPopup() {
    const { scope, appId } = facebookApi;

    let isMobile = false;

    try {
      isMobile = ((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
    } catch (ex) {
      // continue regardless of error
    }

    const params = {
      client_id: appId,
      redirect_uri: window.location.href,
      state: 'facebookdirect',
      scope,
    };

    if (isMobile) {
      window.location.href = `https://www.facebook.com/dialog/oauth?${objectToParams(params)}`;
    } else {
      window.FB.login((response) => {
        if (response.authResponse) {
          this.facebookSignupSuccess(response.authResponse);
        } else {
          this.facebookSignUpCancle();
        }
      }, { scope, auth_type: params.auth_type });
    }
  }

  facebookSignupSuccess(authResponse) {
    window.FB.api('/me', { fields: facebookApi.fields }, (me) => {
      Object.assign(me, authResponse);
      this.props.onSignUpWithFacebook({
        email: this.inputEmail.value,
        clientID: me.userID,
        token: me.accessToken,
        shopName: this.inputShopName.value,
        subDomain: this.inputSubDomain.textContent,
        shownTemplate: this.state.shownTemplate,
        selectedPlan: this.state.selectedPlan,
        isReceiveCyberaNewsLetter: this.state.isReceiveCyberaNewsLetter,
      }, () => {
        this.setState({ loading: false });
      });
    });
  }

  facebookSignUpCancle() {
    this.setState({ loading: false });
  }

  validateShopName(input) {
    const value = input.trim();
    if (value === '') return message.format('require_enter', 'website name');
    if (!/^[-_a-zA-Z0-9\s]+$/.test(value)) return message.format('special_char', ['-', '_']);
    if (value.length < 3) return 'Website name cannot be less than 3 characters';
    const maxLength = validate.isValidLength(value, 50, 'Website name');
    if (maxLength !== true) return maxLength;
    return true;
  }

  validateSubDomain(input) {
    const value = input.trim();
    if (value === '') return message.format('require_enter', 'website URL');
    if (!/^[-_a-z0-9]+$/.test(value)) return message.format('special_char', ['-', '_']);
    const maxLength = validate.isValidLength(value, 150, 'Website URL');
    if (maxLength !== true) return maxLength;
    return true;
  }

  validateEmail(input) {
    const value = input.trim();
    if (value === '') return message.format('require_enter', 'email address');
    if (!validate.isEmail(value)) return message.error.NOT_VALID_EMAIL;
    const maxLength = validate.isValidLength(value, 100, 'Email address');
    if (maxLength !== true) return maxLength;
    return true;
  }

  validatePassword(value) {
    if (value === '') return message.format('require_enter', 'password');
    if (!validate.isPassword(value)) return message.error.PASSWORD_INCORRECT_FORMAT;
    return true;
  }

  editSubDomain() {
    this.setState({ isEditingSubDomain: !this.state.isEditingSubDomain });
  }

  subDomainEncode(value) {
    return value.split(' ').join('-').toLowerCase();
  }

  render() {
    return (
      <div className={styles.background} data-automation-id="popup-signup">
        <div className={styles.box}>
          <h2>Not long to go now!</h2>
          <span>We just need a few details to get you started...</span>
          <br />
          { (this.state.error && !this.props.error) &&
            <div style={{ paddingTop: '10px' }}>
              <ErrorBox data-automation-id="error-box" error={this.state.error} onClose={() => { this.setState({ error: false }); }} />
            </div>
          }
          { this.props.error &&
            <div style={{ paddingTop: '10px' }}>
              <ErrorBox data-automation-id="error-box" error={this.props.error} onClose={() => { this.setState({ error: false }); }} />
            </div>
          }
          <div className={styles.inputBox} style={{ marginTop: '10px' }}>
            <InputWithIcon
              icon={IconShop}
              data-automation-id="input-website-name"
              error={this.state.inputShopNameValidateError}
              isValidating={(typeof this.state.inputShopNameValidateError === 'string')}
              isLoading={this.props.isCheckingShopName || this.state.isCheckingShopName}
            >
              <input
                id="inputShopName"
                ref={(node) => { this.inputShopName = node; }}
                type="text"
                placeholder="Website Name"
                onChange={(evt) => {
                  const targetValue = evt.target.value;
                  this.setState({
                    inputShopNameValidateError: this.validateShopName(targetValue),
                  }, () => {
                    if (this.state.inputShopNameValidateError === true) {
                      const EncodeValue = this.subDomainEncode(targetValue);
                      this.inputSubDomain.innerHTML = EncodeValue === '' ? 'example' : EncodeValue;
                      this.setState({ isCheckingShopName: true, isCheckingSubDomain: true });
                      clearTimeout(this.typingShopNameTimer);
                      this.typingShopNameTimer = setTimeout((value = targetValue) => {
                        if (this.state.inputShopNameValidateError === true) {
                          this.props.onShopNameChange(value);
                          this.onSubDomainChange(value);
                        }
                        this.setState({ isCheckingShopName: false, isCheckingSubDomain: false });
                      }, 1000);
                    }
                  });
                }}
              />
            </InputWithIcon>
          </div>
          <div className={styles.subDomainContainer}>
            <span className={styles.descripSubDomain}>Your default website address is:</span>
            <span // eslint-disable-line
              className={styles.subDomain}
              data-automation-id="content-edit-subdomain"
              ref={(node) => { this.inputSubDomain = node; }}
              suppressContentEditableWarning={Boolean(true)}
              contentEditable={this.state.isEditingSubDomain}
              onBlur={(event) => {
                this.setState({ isEditingSubDomain: false });
                const targetValue = event.target.textContent;
                this.setState({ inputSubDomainValidateError: this.validateSubDomain(targetValue) }, () => {
                  if (this.state.inputSubDomainValidateError === true) this.onSubDomainChange(targetValue);
                });
              }}
              onInput={(event) => {
                const targetValue = event.target.textContent;
                this.setState({ inputSubDomainValidateError: this.validateSubDomain(targetValue) }, () => {
                  if (this.state.inputSubDomainValidateError === true) this.onSubDomainChange(targetValue);
                });
              }}
              onKeyDown={(event) => {
                if (event.keyCode === 13 || event.keyCode === 32) {
                  event.preventDefault();
                }
              }}
            >example</span>
            <span>.cybera.com.au</span>
            { this.state.isCheckingSubDomain ?
              <IconLoading className={styles.subDomainLoading} /> :
              <IconPencil data-automation-id="icon-edit-subdomain" className={styles.iconPencil} onClick={() => this.editSubDomain()} />
            }
            { (this.state.inputSubDomainValidateError !== true || this.props.checkSubDomainError !== true) &&
              <div data-automation-id="error-subdomain" className={styles.subDomainErr}>{this.state.inputSubDomainValidateError}</div>
            }
          </div>
          <div className={`${styles.inputBox} ${styles.inputEmail}`}>
            <InputWithIcon
              id="inputEmail"
              icon={IconMail}
              data-automation-id="input-email"
              error={this.state.inputEmailValidateError}
              isValidating={(typeof this.state.inputEmailValidateError === 'string')}
              isLoading={this.props.isCheckingEmail || this.state.isCheckingEmail}
            >
              <input
                ref={(node) => { this.inputEmail = node; }}
                type="text"
                placeholder="Email"
                onChange={(evt) => {
                  const targetValue = evt.target.value;
                  this.setState({ inputEmailValidateError: this.validateEmail(targetValue) }, () => {
                    if (this.state.inputEmailValidateError === true) {
                      clearTimeout(this.typingEmailTimer);
                      this.setState({ isCheckingEmail: true });
                      this.typingEmailTimer = setTimeout((value = targetValue) => {
                        if (this.state.inputEmailValidateError === true) this.props.onEmailChange(value);
                        this.setState({ isCheckingEmail: false });
                      }, 1000);
                    }
                  });
                }}
              />
            </InputWithIcon>
          </div>
          <div className={`${styles.inputBox} ${styles.inputPassword}`}>
            <InputWithIcon
              id="inputPassword"
              icon={IconKey}
              data-automation-id="input-password"
              error={this.state.inputPasswordValidateError}
              isValidating={(typeof this.state.inputPasswordValidateError === 'string')}
            >
              <input
                ref={(node) => { this.inputPassword = node; }}
                type="password"
                placeholder="Password"
                onBlur={(evt) => {
                  const targetValue = evt.target.value;
                  this.setState({ inputPasswordValidateError: this.validatePassword(targetValue) });
                }}
              />
            </InputWithIcon>
          </div>
          <div className={`${styles.inputBoxSignUp} ${styles.inputBox}`}>
            <Button data-automation-id="btn-signup" onClick={() => { this.onClickSignUp(); }}>
              Sign Up
            </Button>
          </div>
          <div className={styles.orBox}>
            <span className={styles.line}></span>
            <span>OR</span>
            <span className={styles.line}></span>
          </div>
          <div className={`${styles.inputBox} ${styles.inputBoxFacebook}`}>
            <Button
              id="signUpWithFacebook"
              data-automation-id="btn-facebook-signup"
              className={`${styles.btnFacebook}`}
              onClick={() => {
                this.onClickSignUpWithFacebook();
              }}
            >
              <IconFB />Sign up with Facebook
            </Button>
          </div>
          <div className={`${styles.inputBox}`}>
            <div data-automation-id="checkbox-newsletter">
              <Checkbox
                name="isReceiveCyberaNewsLetter"
                className={`${styles.checkbox}`}
                onCheck={(event, value) => this.setState({ isReceiveCyberaNewsLetter: value })}
                label="I would like to subscribe to Cybera newsletter"
                checked={this.state.isReceiveCyberaNewsLetter}
              />
            </div>
            <div data-automation-id="checkbox-terms">
              <Checkbox
                name="isAccept"
                className={`${styles.checkbox}`}
                style={{ width: '35px', float: 'left' }}
                onCheck={(event, value) => this.setState({ isAccept: value, error: false })}
                checked={this.state.isAccept}
              />
              <span className={styles.acceptSpan}>By signing up, I accept <button data-automation-id="btn-terms-conditions" className={styles.termButton} onClick={() => this.setState({ isShowTerm: true })}>terms and conditions</button></span>
            </div>
          </div>
          { this.state.loading ||
            <button
              data-automation-id="btn-close"
              className={styles.close}
              onClick={() => this.props.onClose()}
            >
              <IconClose />
            </button>
          }
          {this.state.loading && <Loading data-automation-id="loading-signup" />}
          {this.state.isShowTerm &&
            (<div className={styles.terms} data-automation-id="popup-terms-conditions">
              <h3>Terms and conditions</h3>
              <div className={styles.termsContent}>
                <p>This site is operated by Cybera (“we” or “our”) Cybera provide a website which you (“you” or “your”) can access and utilise to sell your goods to customers (‘the services”). These terms and conditions are applicable to the Services provided by Cybera including any services that are added in the future. Cybera may update these terms and conditions at any time.</p>
                <p><strong><i>Preliminary</i></strong> </p>
                <ul>
                  <li>You must be a legal entity and/or be at least eighteen (18) years of age to use the Services.</li>
                  <li>You must complete a registration form and provide your full legal name, physical address, a valid email address, telephone number and any other requested information to Cybera before Cybera will allow you to use the Services.</li>
                  <li>Upon successful completion of the registration form and acceptance by Cybera you will be issued with an account in order to use the Services.</li>
                </ul>
                <p><strong><i>Your rights and obligations</i></strong></p>
                <ul>
                  <li>You covenant to use the Services in accordance with these terms and conditions at all times.</li>
                  <li>You will not utilise the Services for any illegal or unauthorised purposes or violate any of the laws of Australia while using the Services.</li>
                  <li>
                    You will not use the Services to:
                    <ul>
                      <li>Sell or offer to sell any controlled substances, illegal drugs or drug paraphernalia, weapons, pirated materials, information relating to the creation of any illegal goods, pornography, escort services or adult services, animal products, animals, birth certificates, drivers licences, explosives, fireworks, hazardous chemicals and the like;</li>
                      <li>Sell items that contain profanities or offensive material;</li>
                      <li>Violate the existing intellectual property rights of third parties;</li>
                      <li>Create, spread or send any virus, worm, Trojans, mail bombing, pinging or undertake server attacks or any other similar technology in any way whatsoever whether they affect the Services or any other third party;</li>
                      <li>Undertake or advertise any illegal activities;</li>
                      <li>Post any threatening, abusive or defamatory material or information;</li>
                      <li>Mislead or falsely advertise goods to a third party;</li>
                      <li>Collect information from Cybera or other third parties; or;</li>
                      <li>Post any content that infringes the rights of third parties</li>
                      <li>You are responsible for the accuracy of all information that is listed and utilised by you in using the Services at all times.</li>
                      <li>You agree to be bound by the terms and conditions within the Cybera Privacy Policy.</li>
                      <li>You agree to provide each customer with the goods that they purchase from you in a timely manner.</li>
                      <li>You agree to guarantee the quality and workmanship of your goods to the customer.</li>
                      <li>You agree that except for the rights provided in these terms and conditions you have no right, title or interest in the Services or Cybera whatsoever.</li>
                      <li>You grant Cybera the right to use your names and trade names, logos, trademarks and the like in advertising and promotional services of Cybera.</li>
                    </ul>
                  </li>
                </ul>
                <p><strong><i>Cybera’s rights and obligations</i></strong></p>
                <ul>
                  <li>Cybera reserves the right to remove, delete or refuse any content that it considers inappropriate or offensive without notice to you.</li>
                  <li>Cybera will not check any information before it is posted on the Cybera website by you or any other third party.</li>
                  <li>Cybera has the right to provide Services to any of your competitors.</li>
                  <li>Cybera takes no responsibility for information posted by you in relation to any goods or services that you are selling via the Services.</li>
                  <li>Cybera takes no responsibility for information posted by third parties using or accessing the Services.</li>
                  <li>Cybera does not warrant that the quality of any service it provides will meet your expectations or be suitable for your use or that any errors in the services it provides will be corrected.</li>
                  <li>Cybera will not disclose any confidential information that you provide to Cybera except as required at law.</li>
                </ul>
                <p><strong><i>Technical Support</i></strong></p>
                <ul>
                  <li>Technical support is available from Cybera by e-mail only.</li>
                </ul>
                <p><strong><i>Payments</i></strong></p>
                <ul>
                  <li>You agree to make all payments to Cybera when they are due. Failure to do so may result in restricted access to the Services.</li>
                  <li>Invoices will be issued monthly and must be paid by credit card.</li>
                  <li>All payments will be inclusive of GST.</li>
                  <li>Cybera does not provide refunds</li>
                  <li>Startup package is free for 12 months. After 11 months you will be given the option to upgrade plans or stick with the startup plan to which you will be charged $15 per month starting from the 12 month anniversary of the initial sign up date. Failure to continue with paid plan will result in your site becoming inactive. Upon payment, your site will become active again.</li>
                </ul>
                <p><strong><i>Copyright and Intellectual Property</i></strong></p>
                <ul>
                  <li>You agree not to reproduce, duplicate, copy, sell, or abuse the Services or any third party in any way.</li>
                  <li>You will not undertake any activities that may infringe the copyright or intellectual property of Cybera or any third party in any way.</li>
                  <li>Cybera does not claim any intellectual property rights whatsoever over any goods or services you endeavour to sell through the Services.</li>
                  <li>You agree to allow third parties to view any content that you post via the Services.</li>
                </ul>
                <p><strong><i>Liability &amp; Indemnity</i></strong></p>
                <ul>
                  <li>Cybera shall not be liable for any direct, indirect, special or any other damages or expenses including loss of profits, damages, loss of goodwill, loss of data or any other loss resulting from your use of the Services.</li>
                  <li>Your use of the Services is at your own risk.</li>
                  <li>You will be liable for and continually indemnify Cybera and its officers, employees and representative agents against all claims, damages, losses, costs and expenses incurred by you or any customer or other third party as a result of a breach of this agreement by you or anything you or your employees, agents representatives, agents or subcontractors do or fail to do pursuant to these terms and conditions.</li>
                  <li>You will be liable to pay all of the claims, losses, expenses, costs and damages of Cybera as a result of any action or inaction by you and such action or inaction entitles any third party to a refund or reimbursement.</li>
                  <li>You will not be liable or required to indemnify Cybera to the extent that the claims, damages, losses, costs or expenses were caused or contributed to by the conduct of Cybera or its officers, employees or representatives.</li>
                </ul>
                <p><strong><i>Communications</i></strong></p>
                <ul>
                  <li>You agree to all communications from Cybera being completed via email to the email address that you provide on the registration form.</li>
                  <li>You agree to deal directly and promptly with the customer or third party in relation to any complaints, refunds, returns or any other matter directly.</li>
                </ul>
                <p><strong><i>Termination</i></strong></p>
                <ul>
                  <li>You may withdraw from using the Services at any time for any reason by providing notice to Cybera via email.</li>
                  <li>Cybera may terminate the Services provided to you at any time for any reason without notice.</li>
                  <li>Upon termination of this agreement by either party all information posted by you will be removed from the website provided by Cybera immediately.</li>
                </ul>
                <p><strong><i>Waiver</i></strong></p>
                <ul>
                  <li>Any waiver in regard to the performance of these terms and conditions operates only if in writing and applies only to the specified instance, and must not affect the existence and continued applicability of these terms and conditions thereafter.</li>
                </ul>
                <p><strong><i>Entire Agreement </i></strong></p>
                <ul>
                  <li>These terms and conditions embody all the terms binding between the parties and replaces all previous representations or proposals.</li>
                </ul>
                <p><strong><i>Assignment</i></strong></p>
                <ul>
                  <li>You must not assign any of your rights under these terms and conditions</li>
                </ul>
                <p><strong><i>Applicable law</i></strong></p>
                <ul>
                  <li>This Agreement must be read and construed according to the laws of the State of Victoria and the parties submit to the jurisdiction of that State and the Commonwealth of Australia.</li>
                </ul>
                <p><strong><i>Severability</i></strong></p>
                <ul>
                  <li>If any provision of this Agreement is held by a court to be unlawful, invalid, unenforceable or in conflict with any rule of law, statute, ordinance or regulation it must be severed so that the validity and enforceability of the remaining provisions are not affected.</li>
                </ul>
              </div>
              <Button
                data-automation-id="btn-accept"
                className={styles.acceptButton}
                onClick={() => this.setState({ isShowTerm: false, isAccept: true })}
              >
                Accept
              </Button>
            </div>)
          }
        </div>
      </div>);
  }
}

RegisterPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onShopNameChange: PropTypes.func.isRequired,

  selectedPlan: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  shownTemplate: PropTypes.number.isRequired,
  onSubDomainChange: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onSignUpWithFacebook: PropTypes.func.isRequired,
  checkShopNameError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  checkSubDomainError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  isCheckingShopName: PropTypes.bool.isRequired,
  // isShopNameAvailable: PropTypes.bool.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  isCheckingEmail: PropTypes.bool.isRequired,
  isEmailAvailable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,

  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

RegisterPopup.defaultProps = {
  error: false,
};

export default RegisterPopup;
