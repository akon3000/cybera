import { createSelector } from 'reselect';

const selectSignUp = (state) => state.get('signUp');

const selectTemplateList = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('templateList')
);

const selectShowTemplate = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('showTemplate')
);

const selectIsClosing = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('isClosing')
);

const selectIsShowPlan = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('isShowPlan')
);

const selectIsClosingPlan = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('isClosingPlan')
);

const selectSelectedPlan = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('selectedPlan')
);

const selectLoading = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('loading')
);

const selectError = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('error')
);

const selectShopName = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('shopName')
);

const selectSubDomain = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('subDomain')
);

const selectIsCheckingShopName = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('isCheckingShopName')
);

const selectIsShopNameAvailable = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('isShopNameAvailable')
);

const selectShopNameError = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('shopNameError')
);

const selectSubDomainError = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('subDomainError')
);

const selectIsCheckingEmail = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('isCheckingEmail')
);

const selectIsEmailAvailable = () => createSelector(
  selectSignUp,
  (signupState) => signupState.get('isEmailAvailable')
);

export {
  selectSignUp,
  selectTemplateList,
  selectShowTemplate,
  selectIsClosing,
  selectIsShowPlan,
  selectIsClosingPlan,
  selectSelectedPlan,
  selectLoading,
  selectError,
  selectShopName,
  selectShopNameError,
  selectSubDomain,
  selectIsCheckingShopName,
  selectIsShopNameAvailable,
  selectIsCheckingEmail,
  selectIsEmailAvailable,
  selectSubDomainError,
};
