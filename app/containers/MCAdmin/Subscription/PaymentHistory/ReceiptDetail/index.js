import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Printicon from 'react-icons/lib/fa/print';

import styles from './styles.css';
import Layout from '../../../Layout';
import ErrorPopup from '../../../../../components/ErrorPopup';
import BreadCrumb from '../../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../../components/AdminLayout/components/Box';
import LogoBlack from '../../../../../assets/image/logoBlack.png';
import { formatDate } from '../../../../../utils';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';

class ReceiptDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReceipt: null,
      isLoading: true,
      error: false,
      Id: this.props.location.query.Id,
    };
  }

  componentDidMount() {
    this.receiptDetails();
  }

  receiptDetails() {
    const _ = this;
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Receipt?$filter=Id eq ${this.state.Id}`, {}, (response) => {
      if (!response.error) {
        if (response.data.Items.length > 0) {
          _.setState({ dataReceipt: response.data.Items[0], isLoading: false });
        }
      } else {
        _.setState({ error: true });
      }
    });
  }

  render() {
    const breadCrumb = [
      <button data-automation-id="btn-merchantsettings-link" key="Settings" onClick={() => this.props.history.push('/MCAdmin/PlanManagement')}>Settings</button>,
      <button data-automation-id="btn-merchant-subscription-link" key="Subscription" onClick={() => this.props.history.push('/MCAdmin/Subscription')}>Subscription</button>,
      <button data-automation-id="btn-merchant-paymenthistory-link" key="Payment History" onClick={() => this.props.history.push('/MCAdmin/Subscription/PaymentHistory')}>Payment History</button>,
      <button data-automation-id="btn-merchant-receipt-link" key="Receipt Details" onClick={() => window.location.reload()}>Receipt Details</button>,
    ];

    return (
      <Layout data-automation-id="page-paymentreceipt" isLoading={this.state.isLoading}>
        <BreadCrumb data-automation-id="breadcrumb-paymentreceipt" breadCrumb={breadCrumb} />
        <h2 className={styles.headLine} title="Receipt">Receipt Details</h2>
        { this.state.dataReceipt !== null &&
          <Box>
            <Row className={styles.pageHeader} middle="xs">
              <Col xs={6}>
                <img alt="Logo Cybera" src={LogoBlack} />
              </Col>
              <Col xs={6}>
                <button data-automation-id="btn-paymentreceipt-print" type="button" title="Print Receipt" className={styles.btnPrint} onClick={window.print}><Printicon /></button>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <table data-automation-id="table-paymentreceipt-head" className={styles.headtableReceipt}>
                  <tbody>
                    <tr>
                      <td><b>Bill To</b></td>
                      <td>Receipt Number :</td>
                      <td>{this.state.dataReceipt.ReceiptNumber}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'normal' }}>{this.state.dataReceipt.Address}</td>
                      <td>Receipt Date :</td>
                      <td>{formatDate(this.state.dataReceipt.ReceiptDate)}</td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <p>Following is your plan details,</p>
                <table data-automation-id="table-paymentreceipt-body" className={styles.tableReceipt}>
                  <tbody>
                    <tr>
                      <td>Plan Description</td>
                      <td>{this.state.dataReceipt.PlanDescription}</td>
                    </tr>
                    <tr>
                      <td>Subscription Type</td>
                      <td>{this.state.dataReceipt.SubscriptionType}</td>
                    </tr>
                    <tr>
                      <td>Total Ex GST</td>
                      <td>$ {this.state.dataReceipt.TotalExGST.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>GST</td>
                      <td>$ {this.state.dataReceipt.GST.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Total Inc GST</td>
                      <td>$ {this.state.dataReceipt.TotalIncGST.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Box>
        }
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-paymentreceipt"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>
    );
  }
}

ReceiptDetail.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default ReceiptDetail;
