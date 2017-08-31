import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { Row, Col } from 'react-flexbox-grid';
import { Field, reduxForm } from 'redux-form/immutable';
import IconAt from 'react-icons/lib/ti/at';
import IconLock from 'react-icons/lib/fa/lock';
import IconFB from 'react-icons/lib/fa/facebook';
import TextField from 'material-ui/TextField';

import styles from './styles.css';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import ErrorBox from '../../../components/ErrorBox';
import objectToParams from '../../../utils/objectToParams';
import auth from '../../../utils/auth';
import logo from '../../../assets/image/logoBlack.png';
import smallLogo from '../../../assets/image/180x65_gray2.png';
import { facebookApi } from '../../../config';
import message from '../../../Message';
import validate from '../../../utils/validate';

export function loginPopupValidate(values) {
  const errors = {};

  const requiredFields = {
    email(value) {
      if (!value) return message.format('require_enter', 'email address');
      if (!validate.isEmail(value)) return message.format('require_enter', 'correct email address');
      const maxLength = validate.isValidLength(value, 100, 'Email address');
      if (maxLength !== true) return maxLength;
      return true;
    },
    password(value) {
      if (!value) return message.format('require_enter', 'password');
      if (!validate.isPassword(value)) return message.error.PASSWORD_INCORRECT_FORMAT;
      return true;
    },
  };

  Object.keys(requiredFields).forEach((key) => {
    const err = requiredFields[key](values.get(key));
    if (err !== true) errors[key] = err;
  });

  return errors;
}

class LoginPopup extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      error: false,
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

  facebookSignUpCancle() {
    this.setState({ isLoading: false });
  }

  facebookSignupSuccess(authResponse) {
    window.FB.api('/me', { fields: facebookApi.fields }, (me) => {
      Object.assign(me, authResponse);

      auth.loginFacebook(me.id, me.accessToken, (response) => {
        if (!response.error) {
          this.props.onLoginSuccess();
        } else {
          this.setState({
            isLoading: false,
            error: response.error,
          });
        }
      });
    });
  }

  facebookLogin() {
    this.setState({ isLoading: true });

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

  submit(values) {
    this.setState({ isLoading: true });
    auth.login(values.get('email'), values.get('password'), (response) => {
      if (!response.error) {
        this.props.onLoginSuccess();
      } else {
        this.setState({
          isLoading: false,
          error: response.error,
        });
      }
    });
  }

  Input (props) { // eslint-disable-line
    const { input, type, hintText, icon, meta: { touched, error } } = props;
    return (
      <div className={`${styles.textField}`} data-automation-id={props['data-automation-id']}>
        {icon}
        <TextField
          errorText={touched && error && <span data-automation-id="error">{error}</span>}
          {...input}
          type={type}
          hintText={hintText}
        />
      </div>
    );
  }

  render() {
    return (
      <Dialog
        modal={Boolean(true)}
        open={Boolean(true)}
        contentStyle={{ maxWidth: '550px', maxHeight: 'none' }}
        bodyStyle={{ maxHeight: 'none' }}
        className={styles.popup}
      >
        <form onSubmit={this.props.handleSubmit((values) => this.submit(values))} data-automation-id="form-force-login">
          <Row center="xs" className={styles.row}>
            <Col xs={12}>
              <img className={styles.logo} src={logo} alt="Cybera" data-automation-id="form-login-logo" />
            </Col>
            <Col xs={12} className={styles.smallLogo}>
              <img src={smallLogo} alt="Cybera" data-automation-id="form-login-logo" />
            </Col>
            { this.state.error &&
              <Col xs={12} style={{ paddingTop: '10px' }}>
                <ErrorBox data-automation-id="error-box" error={this.state.error} onClose={() => { this.setState({ error: false }); }} />
              </Col>
            }

            <Col md={8} xs={12} className={styles.textFieldContainer} style={{ marginTop: '10px' }}>
              <Field label="email" name="email" hintText="Email" type="text" component={this.Input} icon={<IconAt />} data-automation-id="input-email" />
            </Col>
            <Col md={8} xs={12} className={styles.textFieldContainer}>
              <Field label="password" name="password" hintText="Password" type="password" component={this.Input} icon={<IconLock />} data-automation-id="input-password" />
            </Col>
            <Col md={7} xs={12} className={styles.btnSignInContainer}>
              <Button id="SignIn" type="submit" className={styles.btnSignIn} data-automation-id="btn-signin">
                Sign in
              </Button>
            </Col>
            <Col xs={11}>
              <Row className={styles.orLine}>
                <Col xs={5}><hr /></Col>
                <Col xs={2}>Or</Col>
                <Col xs={5}><hr /></Col>
              </Row>
            </Col>
            <Col md={7} xs={12} className={styles.btnSignInContainer}>
              <Button data-automation-id="btn-signin-facebook" id="SignInWithFacebook" type="button" className={styles.btnFacebook} onClick={() => this.facebookLogin()}>
                <IconFB />Sign in with facebook
              </Button>
            </Col>
          </Row>
        </form>
        { this.state.isLoading && <Loading data-automation-id="loading-force-login" /> }
      </Dialog>
    );
  }
}

LoginPopup.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
};

export default reduxForm({ // eslint-disable-line
  form: 'ForceLoginPopup', // a unique name for this form
  validate: loginPopupValidate,                // <--- validation function given to redux-form
})(LoginPopup);
