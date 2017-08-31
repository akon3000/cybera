import React from 'react';
import PropTypes from 'prop-types';
import HomePage from '../Home';
import NewUserRegistrationPopUp from './UserRegistration';

class NewUser extends React.Component {
  constructor() {
    super();
    this.state = {
      showPersonalInfoPopup: true,
    };
  }

  render() {
    const popup = [];
    let pageSource = '';
    if (window.location.href.indexOf('CyberaNewUser') !== -1) {
      pageSource = 'CyberaNewUser';
    } else if (window.location.href.indexOf('MerchantNewUser') !== -1) {
      pageSource = 'MerchantNewUser';
    }

    if (this.state.showPersonalInfoPopup) {
      popup.push(
        <NewUserRegistrationPopUp
          data-automation-id="dialog-new-user-invited"
          key="NewUserRegistrationPopUp"
          history={this.props.history}
          onClose={() => {
            this.setState({ showPersonalInfoPopup: false }, () => {
              this.props.history.push('/');
            });
          }}
          query={this.props.location.query}
          pageSource={pageSource}
        />
      );
    }

    return (
      <div data-automation-id="page-merchant-new-user">
        <HomePage />
        {popup}
      </div>
    );
  }
}

NewUser.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default NewUser;
