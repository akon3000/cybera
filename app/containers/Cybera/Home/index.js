import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import DoubleAngleIcon from 'react-icons/lib/fa/angle-double-down';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import s from './styles.css';
import Review from './review.png';
import Device from './device.png';

export class Home extends Component { // eslint-disable-line
  render() {
    return (
      <div className={s.HomeBody} data-automation-id="page-home">
        <Header data-automation-id="container-header" />
        <Grid style={{ padding: 0 }} fluid className={s.introContainer} data-automation-id="container-feature">
          <Row className={s.introWordsContainer}>
            <Col lg={12} md={12} sm={12} xs={12}>
              <div>
                <b>The straightforward, <span className={s.introBolder}>feature-packed</span><br className={s.mobileShow} />
                  eCommerce platform.<br />
                  <span className={s.introSmaller}>It has never been easier to start your online business</span></b>
              </div>
            </Col>
          </Row>
          <Row className={s.buttonContainer}>
            <Col lg={12} md={12} sm={12} xs={12}>
              <div>
                <Link to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                  <button data-automation-id="btn-get-start" className={s.getStartedButton}>LETS GET STARTED</button>
                </Link>
              </div>
            </Col>
          </Row>
        </Grid>
        <Grid className={s.testimonialContainer} fluid style={{ padding: 0 }} data-automation-id="container-review-default">
          <Row>
            <Col lgOffset={1} lg={5} mdOffset={1} md={5} smOffset={1} sm={10}>
              <div className={s.DeviceImg}>
                <img src={Device} alt="Device" />
              </div>
            </Col>
            <Col lg={4} md={4} sm={8}>
              <div className={s.reviewWords}><b><i>{'"Cybera is so easy to use and saves us '}<br />{' heaps of time"'}</i></b></div>
              <div className={s.clear}></div>
              <div className={s.reviewOwner}>Dionne & Warwick<br />
                <i>Owners of Canard Rouille Café</i></div>
            </Col>
            <Col lg={2} md={2} sm={2}>
              <div className={s.customers}>
                <img src={Review} alt="Customer Review" />
              </div>
            </Col>
          </Row>
        </Grid>
        <Grid className={s.testimonialContainerMobile} fluid style={{ padding: 0 }} data-automation-id="container-review-mobile">
          <Row>
            <Col xs={12}>
              <div className={s.DeviceImgMobile}>
                <img src={Device} alt="Device" />
              </div>
            </Col>
            <Col xs={12}>
              <div className={s.reviewWordsMobile}><b><i>{'"Cybera is so easy to use and saves us '}<br />{' heaps of time"'}</i></b></div>
            </Col>
            <Col xs={12}>
              <div>
                <img src={Review} alt="Customer Review" />
              </div>
            </Col>
            <Col xs={12}>
              <div className={s.reviewOwnerMobile}><div>Dionne & Warwick</div>
                <i>Owners of Canard Rouille Café</i></div>
            </Col>
          </Row>
        </Grid>
        <Grid fluid style={{ padding: 0 }} data-automation-id="container-scatter">
          <Row>
            <Col lg={12} md={12} xs={12}>
              <div className={s.advertiseContainer}>
                <b>Everything You Need to Succeed
                  <div><DoubleAngleIcon size={50} color={'#CC6600'} /></div>
                  <i>{"We don't just say it's never been easier to start an online business, we make it possible."}</i>
                  <div>Cybera handles everything from marketing and payments, to secure checkout and shipping.<br />
                  Leaving you to concentrate on the things you love.</div></b>
              </div>
            </Col>
          </Row>
        </Grid>
        <Grid className={s.servicesContainer} fluid style={{ padding: 0 }} data-automation-id="container-example-service">
          <Row>
            <Col lg={4} md={4} sm={6} xs={12} className={s.service1}>
              <div><b>Accept Online Payment</b></div>
            </Col>
            <Col lg={4} md={4} sm={6} xs={12} className={s.service2}>
              <div><b>Shipping Integration</b></div>
            </Col>
            <Col lg={4} md={4} sm={6} xs={12} className={s.service3}>
              <div><b>Accounting Software Integration</b></div>
            </Col>
            <Col lg={4} md={4} sm={6} xs={12} className={s.service4}>
              <div><b>Advanced Reporting</b></div>
            </Col>
            <Col lg={4} md={4} sm={6} xs={12} className={s.service5}>
              <div className={s.service5Div2}><b>Your Store is designed to work seamlessly on<br />
              PC, mobile and tablet devices</b></div>
              <div className={s.service5Div1}><b>Perfect Viewing on all Devices</b></div>
            </Col>
            <Col lg={4} md={4} sm={6} xs={12} className={s.service6}>
              <div><b>Customisable Templates</b></div>
            </Col>
          </Row>
        </Grid>
        <Footer data-automation-id="container-footer" />
      </div>
    );
  }
}

export default Home;
