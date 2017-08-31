import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import s from './styles.css';
import TemplateBox from './TemplateBox';
import {
          loadTemplateList,
          clickTemplateBox,
          closeTemplate,
          showPlan,
          hidePlan,
          selectPlan,
          shopNameChange,
          checkShopName,
          subDomainChange,
          checkSubDomain,
          emailChange,
          checkEmail,
        } from './actions';
import {
          selectTemplateList,
          selectIsShowPlan,
          selectIsClosingPlan,
          selectIsClosing,
          selectLoading,
          selectError,
          selectShowTemplate,
          selectSelectedPlan,
          selectShopName,
          selectShopNameError,
          selectSubDomain,
          selectIsCheckingShopName,
          selectIsShopNameAvailable,
          selectIsCheckingEmail,
          selectIsEmailAvailable,
          selectSubDomainError,
        } from './selectors';
import TemplatePreview from './TemplatePreview';

import RegisterPopup from './RegisterPopup';
import request from '../../../utils/request';
import { apiUrl, plans } from '../../../config';
import TemplateExample from './TemplateExample';
import BusinessInfoPopup from './BusinessInfoPopup';
import PaymentPopup from '../../../components/PaymentPopup';
import Popup from '../../../components/Popup';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SlideBox from '../../../components/SlideBox';
import auth from '../../../utils/auth';
import Dialog from '../../../components/Dialog';
import Button from '../../../components/Button';

export class SignUp extends React.Component {

  constructor() {
    super();

    this.state = {
      showBusinessInfo: false,
      showPayment: false,
      signUpID: false,
      error: false,
      showExample: false,
      showRegisterPopup: false,
      showEmailVerify: false,
      plans,
      acitveTemplate: 0,
    };
  }

  componentWillMount() {
    this.props.onComponentWillMount();
    let rowSize = 4;

    const screenSize = window.innerWidth;
    if (screenSize < 1200 && screenSize >= 1024) {
      rowSize = 3;
    } else if (screenSize < 1024 && screenSize >= 768) {
      rowSize = 2;
    } else if (screenSize < 768) {
      rowSize = 1;
    }

    this.setState({ rowSize });
  }

  componentDidUpdate() {
    const element = document.getElementById('shownTemplate');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  onSignUpWithFacebook({ email, clientID, token, shopName, subDomain, isReceiveCyberaNewsLetter }, callback) {
    request.post(
      `${apiUrl}/Users/SignUpFacebook`,
      {
        Email: email,
        ClientId: clientID,
        Access_token: token,
        WebsiteName: shopName,
        UrlId: subDomain,
        PlanId: this.props.selectedPlan,
        TemplateId: this.props.showTemplate,
        IsReceiveCyberaNewsLetter: isReceiveCyberaNewsLetter,
      },
      (response) => {
        if (!response.error) {
          this.setState({ showRegisterPopup: false, showBusinessInfo: true, signUpID: response.data.Id });
          window.scrollTo(0, 0);
        } else {
          this.setState({ error: response.error });
          callback();
        }
      });
  }

  onSignUp({ email, password, shopName, subDomain, shownTemplate, selectedPlan, isReceiveCyberaNewsLetter }, callback) {
    request.post(
      `${apiUrl}/Users/SignUp`,
      {
        Email: email,
        Password: password,
        WebsiteName: shopName,
        UrlId: subDomain,
        PlanId: selectedPlan,
        TemplateId: shownTemplate,
        IsReceiveCyberaNewsLetter: isReceiveCyberaNewsLetter,
      },
      (response) => {
        if (!response.error) {
          this.setState({ showRegisterPopup: false, showBusinessInfo: true, signUpID: response.data.Id });
          window.scrollTo(0, 0);
        } else {
          this.setState({ error: response.error });
          callback(response);
        }
      });
  }

  render() {
    const { templateList, showTemplate, isClosing, onCloseTemplate, onClickTemplate, isShowPlan } = this.props;

    let templateListData = [<Col key="templateLoding" xs={12} className={s.loding}>Loading...</Col>];
    let previewTemplate = -1;
    let templatePreviewBox;
    const popup = [];

    if (this.props.error) {
      templateListData = [<Col key="templateLodingError" xs={12} className={s.error}>Error: {this.props.error}</Col>];
    }

    if (templateList && templateList.Items) {
      templateListData = [];
      for (let i = 0; i < templateList.Items.length; i += 1) {
        const item = templateList.Items[i];

        if (item.Id === showTemplate) {
          previewTemplate = i;
        }

        templateListData.push(
          <TemplateBox
            key={`template_${i}`}
            {...item}
            onClick={
              previewTemplate === i && !isClosing ?
              () => onCloseTemplate() :
              () => {
                onClickTemplate(item.Id);
              }
            }
            className={this.state.acitveTemplate === i ? s.shownSingleTemplate : s.hideSingleTemplate}
          />
        );

        if (previewTemplate !== -1 && !this.state.showRegisterPopup) {
          templatePreviewBox = (
            <div
              key={`Preview_${item.Id}`}
              id={`templatePreview_${item.Id}`} // _${item.Id}
              ref={(node) => { this.shownTemplate = node; }}
              className={s.templatePreview}
            >
              <TemplatePreview
                ref={(node) => { this.templatePreview = node; }}
                {...templateList.Items[previewTemplate]}
                isShowPlan={isShowPlan}
                plans={this.state.plans}
                isClosingPlan={this.props.isClosingPlan}
                isClosing={isClosing}
                onClose={() => onCloseTemplate()}
                onClickSelect={
                  this.props.isShowPlan === true && !this.props.isClosingPlan ?
                    () => {
                      this.props.onHidePlan();
                    } : () => {
                      this.props.onShowPlan();
                    }
                  }
                // onHidePlan={() => this.props.onHidePlan()}
                onSelectPlan={(planID) => {
                  this.props.onSelectPlan(planID);
                  this.setState({ selectedPlan: planID, showRegisterPopup: true });
                }}
                onClosePlan={() => {
                  this.props.onHidePlan();
                }}
                showExample={() => this.setState({ showExample: templateList.Items[i] })}
                isShowExample={this.state.showExample}
              />
            </div>
          );
          previewTemplate = -1;
        }
      }
    }

    if (this.state.showRegisterPopup) {
      if (!auth.loggedIn()) {
        popup.push(
          <RegisterPopup
            key="RegisterPopup"
            subDomain={this.props.subDomain}
            onClose={() => {
              this.props.onSelectPlan(false);
              onCloseTemplate();
              this.setState({ showRegisterPopup: false, error: false });
            }}
            onShopNameChange={(evt) => this.props.onShopNameChange(evt)}
            onSubDomainChange={(evt) => this.props.onSubDomainChange(evt)}
            onEmailChange={(evt) => this.props.onEmailChange(evt)}
            isCheckingShopName={this.props.isCheckingShopName}
            checkShopNameError={this.props.checkShopNameError}
            isShopNameAvailable={this.props.isShopNameAvailable}
            isCheckingSubDomain={this.props.isCheckingSubDomain}
            isSubDomainAvailable={this.props.isSubDomainAvailable}
            checkSubDomainError={this.props.checkSubDomainError}
            isCheckingEmail={this.props.isCheckingEmail}
            isEmailAvailable={this.props.isEmailAvailable}
            onSignUp={(params, callback) => {
              onCloseTemplate();
              this.onSignUp(params, callback);
            }}
            onSignUpWithFacebook={(params, callback) => {
              onCloseTemplate();
              this.onSignUpWithFacebook(params, callback);
            }}
            selectedPlan={this.props.selectedPlan}
            shownTemplate={showTemplate}
            error={this.state.error}
          />);
      } else {
        popup.push(
          <Dialog
            key="pleaseLogout"
            title="Please log out"
            onClose={() => {
              this.props.onSelectPlan(false);
              onCloseTemplate();
              this.setState({ showRegisterPopup: false });
            }}
            actions={[
              <Button
                data-automation-id="btn-logout"
                onClick={() => {
                  auth.logout(() => {
                    this.setState({ showRegisterPopup: true });
                  });
                }}
              >Log Out</Button>,
            ]}
          >
            <div className={s.pleaseLogOut} data-automation-id="popup-auth-signup-logout">Please log out from your current account.</div>
          </Dialog>);
      }
    }

    if (this.state.showBusinessInfo && this.state.signUpID) {
      const signUpID = this.state.signUpID;
      popup.push(
        <BusinessInfoPopup
          key="BusinessInfoPopup" signUpID={signUpID}
          onClose={() => {
            this.setState({ showBusinessInfo: false });
          }}
          onSuccess={(isFreeTrial) => {
            if (isFreeTrial) {
              this.setState({ showEmailVerify: true, showBusinessInfo: false });
            } else {
              this.setState({ showPayment: true, showBusinessInfo: false });
            }
          }}
        />
      );
    }

    if (this.state.showPayment) {
      let plan = this.state.plans[0];
      for (let i = 0; i < this.state.plans.length; i += 1) {
        if (this.state.plans[i].Id === this.state.selectedPlan) {
          plan = this.state.plans[i];
        }
      }
      const signUpID = this.state.signUpID;
      popup.push(
        <PaymentPopup
          signUpID={signUpID}
          key="PaymentPopup"
          plan={plan}
          template={templateList.Items.find((template) => template.Id === showTemplate)}
          onClose={() => {
            this.setState({ showPayment: false });
          }}
          onSuccess={() => {
            this.setState({ showEmailVerify: true, showPayment: false });
          }}
        />);
    }

    if (this.state.showEmailVerify) {
      popup.push(
        <Popup
          title="Email verification"
          key="PaymentPopup"
          boxStyle={{ height: '400px', marginTop: '-200px', padding: '120px 60px' }}
          onClose={() => {
            this.setState({ showEmailVerify: false });
          }}
        >
          <h3 style={{ fontFamily: 'Lato', fontSize: '28px' }}>Please verify your email</h3>
          <p style={{ fontFamily: 'Lato', fontSize: '22px' }}>Once you verify your email address, you can get started building your website.</p>
        </Popup>);
    }

    return (
      <div data-automation-id="page-signup" className={s.signUpPage}>
        <Header data-automation-id="container-header" showRegisterPopup={this.state.showRegisterPopup} />
        <div className={s.topTitle} data-automation-id="container-top-title">
          <Grid>
            <div><b>Cybera Templates</b></div>
          </Grid>
        </div>
        <Grid key={'Body'} className={s.gridTemplate} data-automation-id="container-grid-template">
          <Row className={s.headlineContainer}>
            <Col md={12} xs={12}>
              <div><b>You are on your way to your very own Cybera eCommerce store.</b></div><br />
              <div className={s.headlineSmaller}><b>Choose from one of our professionally design website templates</b></div>
            </Col>
          </Row>
          <Row className={s.templatesRow}>
            {templateListData}
          </Row>
          <Row className={s.templatesRowMobile}>
            {(!templateList || !templateList.Items) && templateListData}
            {templateList && templateList.Items && <SlideBox>{templateListData}</SlideBox>}
          </Row>
        </Grid>
        { this.state.showExample &&
          <TemplateExample
            // WebUrl={templateList.Items[showTemplate] && templateList.Items[showTemplate].WebUrl ? templateList.Items[showTemplate].WebUrl : ''}
            WebUrl={'http://ella-demo-4.myshopify.com/'}
            planID={1}
            templateName={this.state.showExample.Name}
            onSelectPlan={(planID) => {
              this.setState({ showExample: false });
              this.props.onSelectPlan(planID);
            }}
            onClickSelect={() => {
              this.props.onShowPlan();
              this.setState({ showExample: false });
            }}
            onClose={() => {
              this.setState({ showExample: false });
              this.props.onCloseTemplate();
            }}
          />
        }
        { popup }
        { templatePreviewBox }
        <Footer data-automation-id="container-footer" />
      </div>
    );
  }
}

SignUp.propTypes = {
  templateList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]),
  showTemplate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]),
  onClickTemplate: PropTypes.func.isRequired,
  onCloseTemplate: PropTypes.func.isRequired,
  isClosing: PropTypes.bool,
  onComponentWillMount: PropTypes.func.isRequired,
  isShowPlan: PropTypes.bool,
  isClosingPlan: PropTypes.bool,
  onShowPlan: PropTypes.func.isRequired,
  onHidePlan: PropTypes.func.isRequired,
  selectedPlan: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]),
  onSelectPlan: PropTypes.func.isRequired,
  subDomain: PropTypes.string,
  checkSubDomainError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isCheckingShopName: PropTypes.bool,
  checkShopNameError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isShopNameAvailable: PropTypes.bool,
  isCheckingSubDomain: PropTypes.bool,
  isSubDomainAvailable: PropTypes.bool,
  onShopNameChange: PropTypes.func.isRequired,
  onSubDomainChange: PropTypes.func.isRequired,
  isCheckingEmail: PropTypes.bool,
  isEmailAvailable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  onEmailChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
};

SignUp.defaultProps = {
  templateList: null,
  showTemplate: false,
  isClosing: false,
  isShowPlan: false,
  isClosingPlan: false,
  selectedPlan: false,
  subDomain: null,
  isCheckingShopName: false,
  checkShopNameError: false,
  isShopNameAvailable: false,
  isCheckingSubDomain: false,
  isSubDomainAvailable: false,
  checkSubDomainError: false,
  isCheckingEmail: false,
  isEmailAvailable: false,
  error: false,
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: () => dispatch(loadTemplateList()),
    onClickTemplate: (templateID) => dispatch(clickTemplateBox(templateID)),
    onCloseTemplate: () => dispatch(closeTemplate()),
    onShowPlan: (isShowPlan) => dispatch(showPlan(isShowPlan)),
    onHidePlan: () => dispatch(hidePlan()),
    onSelectPlan: (planID) => dispatch(selectPlan(planID)),
    onShopNameChange: (value) => {
      dispatch(shopNameChange(value));
      dispatch(checkShopName(value));
    },
    onSubDomainChange: (value) => {
      dispatch(subDomainChange(value));
      dispatch(checkSubDomain(value));
    },
    onEmailChange: (value) => {
      dispatch(emailChange(value));
      dispatch(checkEmail(value));
    },
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  templateList: selectTemplateList(),
  isShowPlan: selectIsShowPlan(),
  isClosingPlan: selectIsClosingPlan(),
  showTemplate: selectShowTemplate(),
  isClosing: selectIsClosing(),
  loading: selectLoading(),
  error: selectError(),
  selectedPlan: selectSelectedPlan(),
  shopName: selectShopName(),
  checkShopNameError: selectShopNameError(),
  isCheckingShopName: selectIsCheckingShopName(),
  isShopNameAvailable: selectIsShopNameAvailable(),
  isCheckingSubDomain: selectIsCheckingShopName(),
  isSubDomainAvailable: selectIsShopNameAvailable(),
  isCheckingEmail: selectIsCheckingEmail(),
  isEmailAvailable: selectIsEmailAvailable(),
  subDomain: selectSubDomain(),
  checkSubDomainError: selectSubDomainError(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
