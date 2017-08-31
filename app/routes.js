import React from 'react';
import Proptypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import auth from './utils/auth';
import { roles, accesses, baseUrl } from './config';
import AsyncRoute from './AsyncRoute';
import { makeSelectLocation } from './containers/App/selectors';

import HomeLoader from './containers/Cybera/Home/loader';
import SignUpLoader from './containers/Cybera/SignUp/loader';
import PackagesLoader from './containers/Cybera/Packages/loader';
import RedirectLoader from './containers/Auth/Redirect/loader';
import SwitchAccountLoader from './containers/Auth/SwitchAccount/loader';
import AccessDeniedLoader from './containers/AccessDenied/loader';
import NotFoundLoader from './containers/NotFoundPage/loader';
import CyberaNewUserLoader from './containers/Cybera/NewUser/loader';
import UserActivateLoader from './containers/Cybera/UserActivate/loader';
import PublicCommentLoader from './containers/Cybera/PublicComment/loader';

/** import merchant Admin */
import MCAdminDashBoardLoader from './containers/MCAdmin/DashBoard/loader';
import MCAdminWebsiteManagementLoader from './containers/MCAdmin/WebsiteManagement/loader';
import MCAdminWebsiteManagementandSocialandGoogleLoader from './containers/MCAdmin/WebsiteManagement/WebsiteandSocialandGoogle/loader';
import MCAdminEditWebsiteDetailsLoader from './containers/MCAdmin/WebsiteManagement/EditWebsiteDetails/loader';
import MCAdminPlanManagementLoader from './containers/MCAdmin/PlanManagement/loader';
import MCAdminSubscriptionLoader from './containers/MCAdmin/Subscription/loader';
import MCAdminSubscriptionPaymentHistoryLoader from './containers/MCAdmin/Subscription/PaymentHistory/loader';
import MCAdminSubscriptionPaymentHistoryReceiptDetailLoader from './containers/MCAdmin/Subscription/PaymentHistory/ReceiptDetail/loader';
import MCAdminStaffLoader from './containers/MCAdmin/Staff/loader';
import MCAdminStaffCreateEditStaffLoader from './containers/MCAdmin/Staff/CreateEditStaff/loader';
import MCAdminStaffCreateEditRoleLoader from './containers/MCAdmin/Staff/CreateEditRole/loader';
import MCAdminUserUpdateProfileLoader from './containers/MCAdmin/User/UpdateProfile/loader';
import MCAdminUserAccountSettingsLoader from './containers/MCAdmin/User/AccountSettings/loader';
import MCAdminPaymentLoader from './containers/MCAdmin/Payment/loader';
import MCAdminUserBlogLoader from './containers/MCAdmin/Blog/Blog/loader';
import MCAdminUserCreateEditBlogLoader from './containers/MCAdmin/Blog/Blog/CreateEditBlog/loader';
import MCAdminUserBlogCategoryLoader from './containers/MCAdmin/Blog/Category/loader';
import MCAdminUserCreateEditCategoryLoader from './containers/MCAdmin/Blog/Category/CreateEditCategory/loader';
import MCAdminUserBlogCommentLoader from './containers/MCAdmin/Blog/Comment/loader';
import MCAdminUserBlogCommentAuditLoader from './containers/MCAdmin/Blog/Comment/AuditComment/loader';
import MCAdminUserBlogSettingsLoader from './containers/MCAdmin/Blog/Settings/loader';
import MCAdminFileManagerLoader from './containers/MCAdmin/FileManager/loader';
import MCAdminDiscountDashBoardLoader from './containers/MCAdmin/DiscountDashBoard/loader';
import MCAdminCreateEditDiscountLoader from './containers/MCAdmin/CreateEditDiscount/loader';
import MCAdminUserAuthLoader from './containers/MCAdmin/Auth/loader';

/** import cybera Admin */
import CBAdminDashboardLoader from './containers/CBAdmin/DashBoard/loader';
import CBAdminMerchantDashBoardLoader from './containers/CBAdmin/MerchantDashBoard/loader';
import CBAdminMerchantDetailsLoader from './containers/CBAdmin/MerchantDetails/loader';
import CBAdminWebsiteDashBoardLoader from './containers/CBAdmin/WebsiteDashBoard/loader';
import CBAdminDiscountDashBoardLoader from './containers/CBAdmin/DiscountDashBoard/loader';
import CBAdminCreateEditDiscountLoader from './containers/CBAdmin/CreateEditDiscount/loader';
import CBAdminCyberaUserLoader from './containers/CBAdmin/CyberaUser/loader';
import CBAdminCreateEditUserLoader from './containers/CBAdmin/CreateEditUser/loader';
import CBAdminCyberaRoleLoader from './containers/CBAdmin/CyberaRole/loader';
import CBAdminCreateEditRoleLoader from './containers/CBAdmin/CreateEditRole/loader';
import CBAdminMerchantReportRegistrationLoader from './containers/CBAdmin/MerchantReport/Registration/loader';
import CBAdminMerchantReportPlanRenewalLoader from './containers/CBAdmin/MerchantReport/PlanRenewal/loader';
import CBAdminMerchantReportPlanModificationLoader from './containers/CBAdmin/MerchantReport/PlanModification/loader';
import CBAdminMerchantReportTotalSpendingLoader from './containers/CBAdmin/MerchantReport/TotalSpending/loader';
import CBAdminMerchantReportOutstandingPaymentLoader from './containers/CBAdmin/MerchantReport/OutstandingPayment/loader';
import CBAdminMerchantReportPlanSubscriptionCancellationLoader from './containers/CBAdmin/MerchantReport/PlanSubscriptionCancellation/loader';
import CBAdminMerchantReportNewsletterSubscriberLoader from './containers/CBAdmin/MerchantReport/NewsletterSubscriber/loader';
import CBAdminFileManagerLoader from './containers/CBAdmin/FileManager/loader';
// import CBAdminMerchantReportExtensionPurchasedLoader from './containers/CBAdmin/MerchantReport/ExtensionPurchased';
import CBAdminMerchantReportFileManagerUsageLoader from './containers/CBAdmin/MerchantReport/FileManagerUsage/loader';

/* import merchant's website */
import WebsitePageLoader from './containers/Websites/Page/loader';
import PageEditorLoader from './containers/PageEditor/loader';

class Routes extends React.PureComponent {

  static contextTypes = {
    store: Proptypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const store = this.context.store;
    if (window.location.origin === baseUrl && window.location.pathname === '/') {
      return (<Switch>
        <AsyncRoute exact path="/" load={HomeLoader()} />
      </Switch>);
    } else if (window.location.origin !== baseUrl) {
      const hostname = window.location.hostname;
      const subDomain = hostname.substring(0, hostname.indexOf('.'));
      localStorage.setItem('subDomain', subDomain);
    }

    return (
      <Switch>
        <AsyncRoute path="/signUp" load={SignUpLoader(store)} />
        <AsyncRoute path="/Packages" load={PackagesLoader()} />
        <AsyncRoute path="/AccessDenied" load={AccessDeniedLoader()} />
        <AsyncRoute path="/CyberaNewUser" load={CyberaNewUserLoader()} />
        <AsyncRoute path="/MerchantNewUser" load={CyberaNewUserLoader()} />
        <AsyncRoute path="/UserActivate" load={UserActivateLoader()} />
        <AsyncRoute path="/PublicComment" load={PublicCommentLoader()} />
        <AsyncRoute path="/PublicCommentReply" load={PublicCommentLoader()} />

        <AsyncRoute path="/Auth/ResetPassword" load={SignUpLoader(store)} />
        <AsyncRoute path="/Auth/Redirect" load={RedirectLoader()} />
        <AsyncRoute path="/Auth/SwitchAccount" load={SwitchAccountLoader()} userRole={roles.MerchantOrCybera} />

        <AsyncRoute exact path="/CBAdmin" load={CBAdminDashboardLoader()} userRole={roles.Cybera} />
        <AsyncRoute path="/CBAdmin/MerchantDashBoard" load={CBAdminMerchantDashBoardLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Merchant} />
        <AsyncRoute path="/CBAdmin/MerchantDetails" load={CBAdminMerchantDetailsLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Merchant} />
        <AsyncRoute path="/CBAdmin/WebsiteDashBoard" load={CBAdminWebsiteDashBoardLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Merchant} />
        <AsyncRoute path="/CBAdmin/DiscountDashBoard" load={CBAdminDiscountDashBoardLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Discount} />
        <AsyncRoute path="/CBAdmin/CreateEditDiscount" load={CBAdminCreateEditDiscountLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Discount} />
        <AsyncRoute path="/CBAdmin/CyberaUser" load={CBAdminCyberaUserLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Staff} />
        <AsyncRoute path="/CBAdmin/CreateEditUser" load={CBAdminCreateEditUserLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Staff} />
        <AsyncRoute path="/CBAdmin/CyberaRole" load={CBAdminCyberaRoleLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Staff} />
        <AsyncRoute path="/CBAdmin/CreateEditRole" load={CBAdminCreateEditRoleLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Staff} />
        <AsyncRoute path="/CBAdmin/MerchantReport/Registration" load={CBAdminMerchantReportRegistrationLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/PlanRenewal" load={CBAdminMerchantReportPlanRenewalLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/PlanModification" load={CBAdminMerchantReportPlanModificationLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/TotalSpending" load={CBAdminMerchantReportTotalSpendingLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/OutstandingPayment" load={CBAdminMerchantReportOutstandingPaymentLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/PlanSubscriptionCancellation" load={CBAdminMerchantReportPlanSubscriptionCancellationLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/NewsletterSubscriber" load={CBAdminMerchantReportNewsletterSubscriberLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute exact path="/MCAdmin" load={MCAdminDashBoardLoader()} userRole={roles.Merchant} />
        <AsyncRoute exact path="/MCAdmin/WebsiteManagement" load={MCAdminWebsiteManagementLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.WebsiteManager} />
        <AsyncRoute path="/MCAdmin/WebsiteManagement/WebsiteSocialGoogle" load={MCAdminWebsiteManagementandSocialandGoogleLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.WebsiteManager} />
        <AsyncRoute path="/MCAdmin/WebsiteManagement/EditWebsiteDetails" load={MCAdminEditWebsiteDetailsLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.WebsiteManager} />
        <AsyncRoute path="/MCAdmin/PlanManagement" load={MCAdminPlanManagementLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.PlanManagement} />
        <AsyncRoute exact path="/MCAdmin/Subscription" load={MCAdminSubscriptionLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.SubscriptionManagement} />
        <AsyncRoute exact path="/MCAdmin/Subscription/PaymentHistory" load={MCAdminSubscriptionPaymentHistoryLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.PaymentManagement} />
        <AsyncRoute path="/MCAdmin/Subscription/PaymentHistory/ReceiptDetail" load={MCAdminSubscriptionPaymentHistoryReceiptDetailLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.PaymentManagement} />
        <AsyncRoute exact path="/MCAdmin/Staff" load={MCAdminStaffLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.StaffManagement} />
        <AsyncRoute path="/MCAdmin/Staff/CreateEditStaff" load={MCAdminStaffCreateEditStaffLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.StaffManagement} />
        <AsyncRoute path="/MCAdmin/Staff/CreateEditRole" load={MCAdminStaffCreateEditRoleLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.StaffManagement} />
        <AsyncRoute path="/MCAdmin/User/UpdateProfile" load={MCAdminUserUpdateProfileLoader()} userRole={roles.Merchant} />
        <AsyncRoute path="/MCAdmin/User/AccountSettings" load={MCAdminUserAccountSettingsLoader()} userRole={roles.Merchant} />
        <AsyncRoute path="/MCAdmin/Payment" load={MCAdminPaymentLoader()} userRole={roles.Merchant} accessPermission={localStorage.getItem('currentPlan') !== 'Web Only (no e-commerce)' ? accesses.Merchant.ShopManagement : 'noAccessPage'} />
        <AsyncRoute exact path="/MCAdmin/Blog/Blog" load={MCAdminUserBlogLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.Blog} />
        <AsyncRoute path="/MCAdmin/Blog/Blog/CreateEditBlog" load={MCAdminUserCreateEditBlogLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.Blog} />
        <AsyncRoute exact path="/MCAdmin/Blog/Category" load={MCAdminUserBlogCategoryLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.Blog} />
        <AsyncRoute path="/MCAdmin/Blog/Category/CreateEditCategory" load={MCAdminUserCreateEditCategoryLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.Blog} />
        <AsyncRoute exact path="/MCAdmin/Blog/Comment" load={MCAdminUserBlogCommentLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.Blog} />
        <AsyncRoute path="/MCAdmin/Blog/Comment/AuditComment" load={MCAdminUserBlogCommentAuditLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.Blog} />
        <AsyncRoute path="/MCAdmin/Blog/Settings" load={MCAdminUserBlogSettingsLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.Blog} />
        <AsyncRoute path="/MCAdmin/FileManager" load={MCAdminFileManagerLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.FileManager} />
        <AsyncRoute path="/MCAdmin/DiscountDashBoard" load={MCAdminDiscountDashBoardLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.ShopManagement} />
        <AsyncRoute path="/MCAdmin/CreateEditDiscount" load={MCAdminCreateEditDiscountLoader()} userRole={roles.Merchant} accessPermission={accesses.Merchant.ShopManagement} />

        <AsyncRoute exact path="/CBAdmin" load={CBAdminDashboardLoader()} userRole={roles.Cybera} />
        <AsyncRoute path="/CBAdmin/MerchantDashBoard" load={CBAdminMerchantDashBoardLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Merchant} />
        <AsyncRoute path="/CBAdmin/MerchantDetails" load={CBAdminMerchantDetailsLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Merchant} />
        <AsyncRoute path="/CBAdmin/WebsiteDashBoard" load={CBAdminWebsiteDashBoardLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Merchant} />
        <AsyncRoute path="/CBAdmin/DiscountDashBoard" load={CBAdminDiscountDashBoardLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Discount} />
        <AsyncRoute path="/CBAdmin/CreateEditDiscount" load={CBAdminCreateEditDiscountLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Discount} />
        <AsyncRoute path="/CBAdmin/CyberaUser" load={CBAdminCyberaUserLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Staff} />
        <AsyncRoute path="/CBAdmin/CreateEditUser" load={CBAdminCreateEditUserLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Staff} />
        <AsyncRoute path="/CBAdmin/CyberaRole" load={CBAdminCyberaRoleLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Staff} />
        <AsyncRoute path="/CBAdmin/CreateEditRole" load={CBAdminCreateEditRoleLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Staff} />
        <AsyncRoute path="/CBAdmin/MerchantReport/Registration" load={CBAdminMerchantReportRegistrationLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/PlanRenewal" load={CBAdminMerchantReportPlanRenewalLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/PlanModification" load={CBAdminMerchantReportPlanModificationLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/TotalSpend" load={CBAdminMerchantReportTotalSpendingLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/OutstandingPayment" load={CBAdminMerchantReportOutstandingPaymentLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/PlanSubscriptionCancellation" load={CBAdminMerchantReportPlanSubscriptionCancellationLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/MerchantReport/NewsletterSubscriber" load={CBAdminMerchantReportNewsletterSubscriberLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/CBAdmin/FileManager" load={CBAdminFileManagerLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.FileManager} />
        <AsyncRoute path="/CBAdmin/MerchantReport/FileManagerUsage" load={CBAdminMerchantReportFileManagerUsageLoader()} userRole={roles.Cybera} accessPermission={accesses.Cybera.Report} />
        <AsyncRoute path="/404" load={NotFoundLoader()} />

        <AsyncRoute exact path="/MCAdmin/Auth" load={MCAdminUserAuthLoader()} />

        <AsyncRoute path="/PageEditor" load={PageEditorLoader(store)} />
        <AsyncRoute path="*" load={WebsitePageLoader()} />
      </Switch>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  location: makeSelectLocation(),
});
export default withRouter(connect(mapStateToProps)(Routes));
