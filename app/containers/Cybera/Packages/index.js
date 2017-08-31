import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import s from './styles.css';
import SlideBox from '../../../components/SlideBox';

class Packages extends Component { // eslint-disable-line
  render() {
    const packagesItems = [];
    packagesItems.push(
      <Col xs={12} key="webonly">
        <div className={s.packagesNormal}>
          <div className={s.packageTitle}><b>WEB &nbsp; ONLY</b></div>
          <div className={s.packageQuote}>
            <b>Perfect for startups or businesses<br />
            looking to find their place online.</b><br />
            <div className={s.packageCharge}><b>$19</b></div><br />
            <i>per month (inc GST)<br style={{ display: 'block' }} />
            Price in Australian Dollars</i>
            <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
              <button className={s.getStartedButton1}>LETS GET STARTED</button>
            </Link>
          </div>
          <div className={s.packageDes}>
            <div className={s.packageDesWords}><b>Fully Responsive<br />
              Admin Dashboard<br />
              1GB Storage<br />
              Google Analytics<br />
            Integrations*</b></div><br />
            <div className={s.packageButtonMobile}><Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
              <button className={s.getStartedButton2}>LETS GET STARTED</button>
            </Link></div>
          </div>
        </div>
      </Col>
    );

    packagesItems.push(
      <Col xs={12} key="greatvalue">
        <div className={s.packagePromotionMobile}>
          <div className={s.promotion}><b>GREAT &nbsp; VALUE</b></div>
          <div className={s.packageTitle}><b>BUSINESS</b></div>
          <div className={s.packageQuote}>
            <b>Ideal for startup eCommerce<br />
              operators looking to switch to a<br />
            feature rich platform.</b>
            <div className={s.packageCharge2}><b>$29</b></div>
            <i>per month (inc GST)<br style={{ display: 'block' }} />
            Price in Australian Dollars</i>
            <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
              <button className={s.getStartedButton1}>LETS GET STARTED</button>
            </Link>
          </div>
          <div className={s.packageDes}>
            <div className={s.packageDesWords}><b>Fully Responsive<br />
              Admin Dashboard<br />
              5GB Storage<br />
              Google Analytics<br />
              Integrations*<br />
            100 Products</b></div>
            <div className={s.packageButtonMobile}><Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
              <button className={s.getStartedButton3}>
                <span><b>FREE 30 DAY TRIAL</b></span><br style={{ display: 'block' }} />
                LETS GET STARTED
              </button></Link></div>
          </div>
        </div>
      </Col>
    );

    packagesItems.push(
      <Col xs={12} key="enterprise">
        <div className={s.packagesNormal}>
          <div className={s.packageTitle}><b>ENTERPRISE</b></div>
          <div className={s.packageQuote}>
            <b>Perfect for larger established<br />
              eCommerce operators looking to<br />
            switch to a feature rich platform.</b>
            <div className={s.packageCharge2}><b>$65</b></div>
            <i>per month (inc GST)<br style={{ display: 'block' }} />
            Price in Australian Dollars</i>
            <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
              <button className={s.getStartedButton1}>LETS GET STARTED</button>
            </Link>
          </div>
          <div className={s.packageDes}>
            <div className={s.packageDesWords}><b>Fully Responsive<br />
              Admin Dashboard<br />
              20GB Storage<br />
              Google Analytics<br />
              Integrations*<br />
            500 Products</b></div>
            <div className={s.packageButtonMobile}><Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
              <button className={s.getStartedButton2}>LETS GET STARTED</button>
            </Link></div>
          </div>
        </div>
      </Col>
    );

    packagesItems.push(
      <Col xs={12} key="unlimited">
        <div className={s.packagesNormal}>
          <div className={s.packageTitle}><b>UNLIMITED</b></div>
          <div className={s.packageQuote}>
            <b>Ideal for established eCommerce<br />
              operators looking to switch to a<br />
            feature rich platform.</b>
            <div className={s.packageCharge2}><b>$145</b></div>
            <i>per month (inc GST)<br style={{ display: 'block' }} />
            Price in Australian Dollars</i>
            <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
              <button className={s.getStartedButton1}>LETS GET STARTED</button>
            </Link>
          </div>
          <div className={s.packageDes}>
            <div className={s.packageDesWords}><b>Fully Responsive<br />
              Admin Dashboard<br />
              Unlimited Storage<br />
              Google Analytics<br />
              Integrations*<br />
            Unlimited Products</b></div>
            <div className={s.packageButtonMobile}><Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
              <button className={s.getStartedButton2}>LETS GET STARTED</button>
            </Link></div>
          </div>
        </div>
      </Col>
    );

    return (
      <div className={s.PlanBody} data-automation-id="page-package">
        <Header data-automation-id="container-header" />
        <Grid style={{ padding: 0 }} fluid data-automation-id="container-package">
          <Row className={s.titleContainer} data-automation-id="package-title">
            <Col lg={12} md={12} sm={12} xs={12}>
              <div><b>Cybera Packages</b></div>
            </Col>
          </Row>
          <Row className={s.packagesContainer} data-automation-id="package-grid-item">
            <Col lg={3} md={3} sm={6}>
              <div className={s.packagesNormal}>
                <div className={s.packageTitle}><b>WEB &nbsp; ONLY</b></div>
                <div className={s.packageQuote}>
                  <b>Perfect for startups or businesses<br />
                  looking to find their place online.</b><br />
                  <div className={s.packageCharge}><b>$19</b></div>
                  <i>per month (inc GST)<br />
                  Price in Australian Dollars</i>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button className={s.getStartedButton1}>LETS GET STARTED</button>
                  </Link>
                </div>
                <div className={s.packageDes}>
                  <div><b>Fully Responsive<br />
                    Admin Dashboard<br />
                    1GB Storage<br />
                    Google Analytics<br />
                  Integrations*</b></div><br />
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button className={s.getStartedButton2}>LETS GET STARTED</button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={3} md={3} sm={6}>
              <div className={s.packagePromotionMobile}>
                <div className={s.promotion}><b>GREAT &nbsp; VALUE</b></div>
                <div className={s.packageTitle}><b>BUSINESS</b></div>
                <div className={s.packageQuote}>
                  <b>Ideal for startup eCommerce<br />
                    operators looking to switch to a<br />
                  feature rich platform.</b>
                  <div className={s.packageCharge2}><b>$29</b></div>
                  <i>per month (inc GST)<br />
                  Price in Australian Dollars</i>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button className={s.getStartedButton1}>LETS GET STARTED</button>
                  </Link>
                </div>
                <div className={s.packageDes}>
                  <div><b>Fully Responsive<br />
                    Admin Dashboard<br />
                    5GB Storage<br />
                    Google Analytics<br />
                    Integrations*<br />
                  100 Products</b></div>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button className={s.getStartedButton3}>
                      <span><b>FREE 30 DAY TRIAL</b></span><br />
                      LETS GET STARTED
                    </button></Link>
                </div>
              </div>
            </Col>
            <Col lg={3} md={3} sm={6}>
              <div className={s.packagesNormal}>
                <div className={s.packageTitle}><b>ENTERPRISE</b></div>
                <div className={s.packageQuote}>
                  <b>Perfect for larger established<br />
                    eCommerce operators looking to<br />
                  switch to a feature rich platform.</b>
                  <div className={s.packageCharge2}><b>$65</b></div>
                  <i>per month (inc GST)<br />
                  Price in Australian Dollars</i>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button className={s.getStartedButton1}>LETS GET STARTED</button>
                  </Link>
                </div>
                <div className={s.packageDes}>
                  <div><b>Fully Responsive<br />
                    Admin Dashboard<br />
                    20GB Storage<br />
                    Google Analytics<br />
                    Integrations*<br />
                  500 Products</b></div>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button className={s.getStartedButton2}>LETS GET STARTED</button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={3} md={3} sm={6}>
              <div className={s.packagesNormal}>
                <div className={s.packageTitle}><b>UNLIMITED</b></div>
                <div className={s.packageQuote}>
                  <b>Ideal for established eCommerce<br />
                    operators looking to switch to a<br />
                  feature rich platform.</b>
                  <div className={s.packageCharge2}><b>$145</b></div>
                  <i>per month (inc GST)<br />
                  Price in Australian Dollars</i>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button className={s.getStartedButton1}>LETS GET STARTED</button>
                  </Link>
                </div>
                <div className={s.packageDes}>
                  <div><b>Fully Responsive<br />
                    Admin Dashboard<br />
                    Unlimited Storage<br />
                    Google Analytics<br />
                    Integrations*<br />
                  Unlimited Products</b></div>
                  <Link data-automation-id="link-to-signup" to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button className={s.getStartedButton2}>LETS GET STARTED</button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
          <Row className={s.packagesContainerMobile} data-automation-id="package-grid-item-mobile">
            <div className={s.slideBoxContainer}>
              <SlideBox>{packagesItems}</SlideBox>
            </div>
          </Row>
        </Grid>
        <Footer data-automation-id="container-footer" />
      </div>
    );
  }
}

export default Packages;
