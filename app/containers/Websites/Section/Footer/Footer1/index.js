import React from 'react';

import './styles.css';
import logo from './logo.png';

class Footer1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer
        className="footer1"
        data-automation-id="section-footer"
        data-automation-design="footer-1"
        data-automation-section-id={id} // eslint-disable-line
      >
        <div className="row">
          <div className="col-12-sm">
            <img src={logo} alt="logo" />
          </div>
        </div>
        <div className="row footer1-body">
          <div className="col-6-sm footer1-body-left">
            <p><i className="footer1-icons footer1-icons-email"></i> email@address.com.au</p>
            <p><i className="footer1-icons footer1-icons-phone"></i> (03) 1234 6789</p>
          </div>
          <div className="col-6-sm footer1-body-right">
            <p><i className="footer1-icons footer1-icons-address"></i> 32 Astreet Road, Asuburb Cicy Australia</p>
          </div>
        </div>
        <div className="row footer1-socials-container">
          <button className="footer1-socials footer1-socials-facebook"><i></i></button>
          <button className="footer1-socials footer1-socials-instagram"><i></i></button>
          <button className="footer1-socials footer1-socials-google"><i></i></button>
          <button className="footer1-socials footer1-socials-twitter"><i></i></button>
        </div>
        <div className="row footer1-copyright">
          © {new Date().getFullYear()} Cybera All rights reserved.
        </div>
      </footer>
    );
  }
}

export default Footer1;
