import React from 'react';
import PropTypes from 'prop-types';

import LoadingPage from '../../../components/LoadingPage';
import Popup from '../../../components/Popup';
import Button from '../../../components/Button';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';
import auth from '../../../utils/auth';

class Redirect extends React.Component {
  constructor() {
    super();
    this.state = {
      error: false,
    };
  }

  componentDidMount() {
    const queryString = this.props.location.query;
    request.get(
      `${apiUrl}/Auth/AutoLogin?Key=${queryString.key}&Value=${queryString.value}`,
      {},
      (response) => {
        if (!response.error) {
          auth.updateToken(response.data.access_token, () => {
            auth.getUser((user) => {
              let websiteId = user.WebsiteRoles[0].WebsiteId;
              if (queryString.websiteId) {
                websiteId = queryString.websiteId;
              }

              auth.setWebsiteID(websiteId, () => {
                if (queryString.page) {
                  this.props.history.push(queryString.page);
                } else {
                  this.props.history.push('/MCAdmin');
                }
              });
            });
          });
        } else {
          this.setState({ error: response.error });
        }
      });
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
        >
          <p style={{ fontFamily: 'Lato', fontSize: '22px', color: 'red' }}>
            {this.state.error}
          </p>
          <p style={{ textAlign: 'center' }}>
            <Button onClick={() => { this.props.history.push('/'); }}>Go to home page</Button>
          </p>
        </Popup>);
    }
    return <LoadingPage>{popup}</LoadingPage>;
  }
}

Redirect.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Redirect;
