import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import ShopIcon from './shop.png';
import styles from './styles.css';
import auth from '../../../utils/auth';
import { apiUrl } from '../../../config';
import request from '../../../utils/request';
import Loading from '../../../components/Loading';

class SwitchAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      CyberaRoleActive: false,
      CyberaRoleName: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    auth.updateUser((user) => {
      this.setState({
        isLoading: false,
        CyberaRoleActive: user.IsCyberaRoleActive,
        CyberaRoleName: user.CyberaRoleName,
        roles: user.WebsiteRoles,
      });
    });
  }

  render() {
    return (<div className={styles.container}>
      <h1>Choose Account</h1>
      <h2>Choose the website you wish to manage</h2>
      <div className={styles.accountContainer}>
        {this.state.CyberaRoleActive &&
          <span key="CyberaAdmin" className={styles.accountBoxes}>
            <img src={ShopIcon} alt="presentation" />
            <h1>Cybera Admin</h1>
            <h2>{this.state.CyberaRoleName}</h2>
            <RaisedButton
              label="Choose"
              backgroundColor="#F5803A"
              labelColor="#FFF"
              labelStyle={{ padding: '0 30px' }}
              onClick={() => {
                this.setState({ isLoading: true });
                request.post(`${apiUrl}/login/Cybera`, {}, () => {
                  this.props.history.push('/CBAdmin');
                });
              }}
            />
          </span>
        }

        {this.state.roles &&
          this.state.roles.map((role) =>
            <span key={role.RoleId} className={styles.accountBoxes}>
              <img src={ShopIcon} alt="presentation" />
              <h1>{role.WebsiteName}</h1>
              <h2>{role.RoleName}</h2>
              <RaisedButton
                label="Choose"
                backgroundColor="#F5803A"
                labelColor="#FFF"
                labelStyle={{ padding: '0 30px' }}
                onClick={() => {
                  this.setState({ isLoading: true });
                  request.post(`${apiUrl}/login/Website/${role.WebsiteId}`, {}, () => {
                    auth.setWebsiteID(role.WebsiteId, () => {
                      auth.updateClaims(() => {
                        auth.getWebsite((website) => {
                          auth.getAccesses('Merchant', () => {
                            if (website.PaymentStatus === 'Overdue') {
                              this.props.history.push('/MCAdmin/Subscription?Overdue=true');
                            } else {
                              this.props.history.push('/MCAdmin');
                            }
                          });
                        });
                      });
                    });
                  });
                }}
              />
            </span>
          )
        }
      </div>
      {this.state.isLoading && <Loading />}
    </div>);
  }
}

SwitchAccount.propTypes = {
  history: PropTypes.object.isRequired,
};

export default SwitchAccount;
