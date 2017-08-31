import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
// import Box from '../../../components/AdminLayout/components/Box';
import WinnerPopup from './WinnerPopup';
import GetStart from './GetStart';
// import styles from './styles.css';
import PaymentPopup from '../../../components/PaymentPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';

class DashBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      popup: false,
      isLoading: props.location.query.ShowRenewal === 'true',
    };
  }

  componentDidMount() {
    let popup;
    if (this.props.location.query.ShowRenewal) {
      request.get(`${apiUrl}/Claims`, {}, (response) => {
        if (!response.error) {
          if (response.data) {
            const filtered = response.data.filter((x) => x.Type === 'http://www.cybera.com.au/claims/websites');
            if (filtered[0] && filtered[0].Value[0]) {
              request.get(`${apiUrl}/Websites/${filtered[0].Value[0]}/WebsitePlan/false`, {}, (responsePlan) => {
                popup = (<PaymentPopup
                  data-automation-id="dialog-merchant-payment-popup"
                  key="PaymentPopup"
                  websiteID={filtered[0].Value[0]}
                  onClose={() => {
                    this.props.history.push('/MCAdmin');
                  }}
                  plan={responsePlan.data.PlanDetail}
                  onSuccess={() => {
                    const popupRenewal = (
                      <SuccessPopup
                        data-automation-id="popup-success-renewal"
                        onClose={() => this.setState({ popup: false })}
                      >
                        <h3>Renewal Success</h3>
                        <div> Thanks for your payment. Please check your email inbox.</div>
                      </SuccessPopup>
                    );
                    this.setState({ popup: popupRenewal }, () => {
                      this.props.history.push('/MCAdmin');
                    });
                  }}
                />);
                this.setState({ popup, isLoading: false });
              });
            }
          }
        } else {
          this.setState({ error: response.error });
        }
      });
    }
  }

  render() {
    return (
      <Layout data-automation-id="page-merchantdashboard" openedMenu="Merchants" activeMenu="Administration" isLoading={this.state.isLoading}>
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-merchantdashboard-link" key="Dashboard" onClick={() => window.location.reload()}>Dashboard</button>,
          ]}
        />
        {
          // <h2>Dashboard</h2>
          // <Box>
          //   DashBoard
          // </Box>
        }
        {this.state.popup}
        {this.props.location.query.Welcome && <WinnerPopup key="WinnerPopup" />}
        {this.props.location.query.GetStart && <GetStart key="GetStart" />}
      </Layout>);
  }
}

DashBoard.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default DashBoard;
