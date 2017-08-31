import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Table from '../../../../../app/components/Table';
import { apiUrl } from '../../../../config';
import { formatDate } from '../../../../utils';
import styles from './styles.css';
import ErrorPopup from '../../../../../app/components/ErrorPopup';
import request from '../../../../utils/request';

class NewsletterSubscriber extends Component { // eslint-disable-line

  constructor() {
    super();
    this.state = {
      error: false,
      data: [],
      merchantNumber: 0,
      publicNumber: 0,
    };
  }

  componentDidMount() {
    const self = this;
    let merchantNumber = 0;
    let publicNumber = 0;
    request.get(`${apiUrl}/Report/MerchantNewsletterSubscriber`, {}, (response) => {
      if (response.data) {
        self.setState({ data: response.data.Items });
        self.state.data.forEach((value) => {
          if (value.FirstName) {
            merchantNumber += 1;
          } else {
            publicNumber += 1;
          }
        });
        self.setState({
          merchantNumber,
          publicNumber,
        });
      }
    });
  }

  render() {
    const header = [
      { Label: 'Title', Name: 'Title', align: 'center' },
      { Label: 'Name', Name: 'Name', className: styles.name, align: 'center' },
      { Label: 'Phone Number', Name: 'Phone Number', align: 'center' },
      { Label: 'Email Address', Name: 'Email Address', align: 'center' },
      { Label: 'Date of Birth', Name: 'DateofBirth', align: 'center' },
      { Label: 'DateofBirth', Name: 'Hide', align: 'center' },
    ];

    const body = [
      (value) => (value.Title && value.Title.Name),
      (value) => (value.FirstName ? `${value.FirstName} ${value.LastName}` : ''),
      (value) => value.PhoneNumber,
      (value) => value.Email,
      (value) => (value.BirthDate ? formatDate(value.BirthDate) : ''),
      (value) => value.BirthDate,
    ];

    const downloadBody = [
      (value) => value.Title,
      (value) => value.Name,
      (value) => value['Phone Number'],
      (value) => value['Email Address'],
      (value) => value['Date of Birth'],
    ];

    return (
      <Layout data-automation-id="page-report-newslettersubscription" openedMenu="Reports" activeMenu="Newsletter Subscription">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-report-registration-link" key="Reports" onClick={() => this.props.history.push('/CBAdmin/MerchantReport/Registration')}>Report</button>,
            <button data-automation-id="btn-report-newslettersubscription-link" key="Newsletter Subscription" onClick={() => window.location.reload()}>Newsletter Subscription</button>,
          ]}
        />
        <h2>Newsletter Subscription</h2>
        <Box>
          <Row>
            <Col xs={9} sm={4} md={4} lg={4}>
              <ul className={styles.subscriberList}>
                <li><b>Merchant</b></li>
                <li>Merchant subscribe for newsletter in sign up process</li>
              </ul>
            </Col>
            <Col xs={3} sm={2} md={2} lg={2}>
              <ul className={styles.subscriberNumber}>
                <li><b>Subscribers</b></li>
                <li data-automation-id="li-report-newslettersubscription-merchantnumber">{this.state.merchantNumber}</li>
              </ul>
            </Col>
            <Col xs={9} sm={4} md={4} lg={4}>
              <ul className={styles.subscriberList}>
                <li><b>Public</b></li>
                <li>Public subscribe for newsletter through eCommerce website</li>
              </ul>
            </Col>
            <Col xs={3} sm={2} md={2} lg={2}>
              <ul className={styles.subscriberNumber}>
                <li><b>Subscribers</b></li>
                <li data-automation-id="li-report-newslettersubscription-publicnumber">{this.state.publicNumber}</li>
              </ul>
            </Col>
          </Row>
          <Table
            data-automation-id="table-report-newslettersubscription"
            dataSource="Report/MerchantNewsletterSubscriber"
            header={header}
            body={body}
            downloadBody={downloadBody}
            filter={[]}
            fileName="Newsletter Subscribers"
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-report-newslettersubscription"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

NewsletterSubscriber.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewsletterSubscriber;
