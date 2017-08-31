import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import LifeBouyIcon from 'react-icons/lib/fa/life-bouy';
import LockIcon from 'react-icons/lib/fa/lock';
import FacebookIcon from 'react-icons/lib/fa/facebook';
import LinkedinIcon from 'react-icons/lib/fa/linkedin';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import InstagramIcon from 'react-icons/lib/fa/instagram';
import CopyrightIcon from 'react-icons/lib/md/copyright';
import ArrowUpIcon from 'react-icons/lib/fa/angle-up';
import { Link } from 'react-router-dom';

import s from './styles.css';
import Logo from './logo.png';
import LogoFooter from './logo_footer.png';
import HandIpad from './hand-ipad.png';
import SubscribeForm from '../SubscribeForm';
import GetInTouchForm from '../GetInTouchForm';

import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';

import { version } from '../../../../../package.json';

export class Footer extends Component { // eslint-disable-line

  constructor() {
    super();
    this.state = {
      backendVersion: '',
    };
  }

  componentDidMount() {
    request.get(`${apiUrl}/system/version`, {}, (response) => {
      if (response.data) {
        this.setState({ backendVersion: response.data.Ver });
      }
    });
  }

  ScrollToTop() {
    const element = document.getElementById('Topbar');
    element.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <Grid className={s.container} fluid key={'Footer'} data-automation-id={this.props['data-automation-id']}>
        <Row className={s.getStartedContainer} data-automation-id="footer-scatter-1">
          <Col lg={4} md={4} sm={4} xs={12}>
            <div className={s.logoDiv}>
              <span><b> Manage Your Store<br />
                From Everywhere<br /></b></span>
              <br />
              <img src={Logo} alt="Cybera Logo" data-automation-id="image-logo" />
            </div>
          </Col>
          <Col lg={4} md={4} sm={4} xs={12}>
            <div className={s.handIpad}>
              <img src={HandIpad} alt="Handing Ipand" data-automation-id="image-hand-device" />
            </div>
          </Col>
          <Col lg={4} md={4} sm={4} xs={12}>
            <div className={s.buttonContainer}>
              <Link to={'/signUp'} style={{ textDecoration: 'none', color: '#FFF' }} data-automation-id="link-to-signup">
                <button className={s.getStartedButton}>LETS GET STARTED</button>
              </Link>
            </div>
          </Col>
          <Col xs={12}>
            <div className={s.handIpadMobile}>
              <img src={HandIpad} alt="Handing Ipand" />
            </div>
          </Col>
        </Row>
        <Row className={s.infoContainer} data-automation-id="footer-scatter-2">
          <Col lg={4} md={4} sm={4} xs={12}>
            <div className={s.infoDiv}><span><CheckIcon size={35} /><b> 30 days</b></span><b> money back guarantee</b></div>
          </Col>
          <Col lg={4} md={4} sm={4} xs={12}>
            <div className={s.infoDiv}><span><LifeBouyIcon size={35} /><b> Support</b></span><b> from a friendly local team</b></div>
          </Col>
          <Col lg={4} md={4} sm={4} xs={12}>
            <div className={s.infoDiv}><span><LockIcon size={35} /><b> Safe & Secure</b></span><b> online shopping</b></div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12} className={s.subscribeContainer}>
            <span><b>Subscribe To Our Newsletter</b></span>
            <br />
            <br />
            <SubscribeForm data-automation-id="subscriber-form" />
          </Col>
        </Row>
        <Row className={s.contactContainer} data-automation-id="footer-scatter-3">
          <Col lg={6} md={6} sm={6} xs={12}>
            <div id="ContactUs" className={s.contactInfoContainer}>
              <div className={s.findUs}><b>Find Us</b></div>
              <br className={s.removeTablet} />
              <div className={s.map}>
                <iframe
                  data-automation-id="ifram-google-map-cybera"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12570.469962953743!2d145.343089!3d-38.032696!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x81606e90742cba57!2sCybera+Digital!5e0!3m2!1sen!2sau!4v1484701425540"
                  width="100%" height="100%"
                >
                </iframe>
              </div>
              <div className={s.address}>
                <b>Suite 5, 18-24 Clyde Road<br />
                  Berwick<br />
                VIC 3806</b>
              </div>
              <div className={s.emailNnumber}>
                <b>Sales@cybera.com.au</b>
                <br />
                <br />
                <span><b>1800 292 372</b></span>
              </div>
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <div className={s.getInTouchContainer}>
              <div className={s.findUs}><b>Get in Touch</b></div>
              <br className={s.removeTablet} />
              <div className={s.getInTouchForm}>
                <GetInTouchForm data-automation-id="get-in-touch-form" />
              </div>
            </div>
          </Col>
        </Row>
        <Row className={s.socialMediaContainer} data-automation-id="footer-scatter-4">
          <Col lgOffset={4} lg={1} mdOffset={4} md={1} smOffset={4} sm={1} xs={3}>
            <a data-automation-id="link-to-twitter-cybera" href="https://twitter.com/CyberaDigital" target="_blank">
              <TwitterIcon size={35} className={s.socialMediaLink} />
            </a>
          </Col>
          <Col lg={1} md={1} sm={1} xs={3}>
            <a data-automation-id="link-to-facebook-cybera" href="https://www.facebook.com/cyberadigital/" target="_blank">
              <FacebookIcon size={35} className={s.socialMediaLink} />
            </a>
          </Col>
          <Col lg={1} md={1} sm={1} xs={3}>
            <a data-automation-id="link-to-linkedin-cybera" href="https://www.linkedin.com/company/cybera-e-commerce?trk=biz-companies-cym" target="_blank">
              <LinkedinIcon size={35} className={s.socialMediaLink} />
            </a>
          </Col>
          <Col lg={1} md={1} sm={1} xs={3}>
            <a data-automation-id="link-to-instagram-cybera" href="https://www.instagram.com/cyberadigital/" target="_blank">
              <InstagramIcon size={35} className={s.socialMediaLink} />
            </a>
          </Col>
        </Row>
        <Row className={s.backtoTopContainer} data-automation-id="footer-scatter-5">
          <Col sm={12} xs={12}>
            <button data-automation-id="btn-back-to-top" onClick={() => this.ScrollToTop()}><ArrowUpIcon size={25} />
              <div>Back To Top</div></button>
          </Col>
        </Row>
        <Row className={s.bottomFooter} data-automation-id="footer-scatter-6">
          <Col lgOffset={1} lg={2} mdOffset={1} md={2} className={s.footerLogo}>
            <img src={LogoFooter} alt="Cybera Logo" data-automation-id="image-logo" />
          </Col>
          <Col lg={2} md={2} className={s.copyright}>
            <span><CopyrightIcon />{currentYear} Cybera <small>v{version}{this.state.backendVersion && ` - v${this.state.backendVersion}`}</small></span>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Footer.propTypes = {
  'data-automation-id': PropTypes.string,
};

Footer.defaultProps = {
  'data-automation-id': '',
};

export default Footer;
