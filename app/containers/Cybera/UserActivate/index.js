import React from 'react';
import PropTypes from 'prop-types';

import LoadingPage from '../../../components/LoadingPage';
import Popup from '../../../components/Popup';
import Button from '../../../components/Button';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';
import auth from '../../../utils/auth';

class UserActive extends React.Component {
  constructor() {
    super();
    this.state = {
      error: false,
      isFirstLoad: true,
    };
  }

  componentDidMount() {
    if (this.state.isFirstLoad) {
      const queryString = this.props.location.query;
      request.get(
        `${apiUrl}/Users/Activate?Key=${queryString.key}&Value=${queryString.value}`,
        {},
        (response) => {
          if (!response.error) {
            auth.updateToken(response.data.access_token, () => {
              auth.getUser((user) => {
                auth.setWebsiteID(user.WebsiteRoles[0].WebsiteId, () => {
                  this.setState({ isFirstLoad: false }, () => {
                    this.props.history.push('/MCAdmin?Welcome=true');
                  });
                });
              });
            });
          } else {
            this.setState({ error: response.error, isFirstLoad: false });
          }
        });
    }
  }

  render() {
    const popup = [];
    if (this.state.error) {
      popup.push(
        <Popup
          title="Email verification"
          key="PaymentPopup"
          boxStyle={{ height: 'auto', marginTop: '-200px', padding: '120px 60px' }}
          onClose={() => {
            this.props.history.push('/');
          }}
          data-automation-id="popup-email-verification"
        >
          <p style={{ fontFamily: 'Lato', fontSize: '22px', color: 'red' }}>
            {this.state.error}
          </p>
          <p style={{ textAlign: 'center' }}>
            <Button data-automation-id="btn-link-to-home" onClick={() => { this.props.history.push('/'); }}>Go to home page</Button>
          </p>
        </Popup>);
    }
    return <LoadingPage>{popup}</LoadingPage>;
  }
}

UserActive.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default UserActive;
