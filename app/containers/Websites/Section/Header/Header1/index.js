import React from 'react';

import './styles.css';
// import logo from './logo.png';

class Header1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <header
        className="header1"
        data-automation-id="section-header"
        data-automation-design="header-1"
        data-automation-section-id={id} // eslint-disable-line
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-2 col-sm-6">
              <button className="header1-logo"><img src="http://i36.photobucket.com/albums/e47/nantawatcybera/template1-logo_zpsu7pr4yar.png" alt="logo" /></button>
            </div>
            <div className="col-lg-10 col-sm-6">
              <div className="header1-menu-contianer">
                <button className="header1-menu header1-menu-search hidden-sm">
                  <i></i>
                </button>
                <button className="header1-menu header1-menu-account hidden-sm"><i></i></button>
                <button className="header1-menu header1-menu-cart hidden-sm">
                  <i></i>
                  <span className="header1-menu-cart-count">1</span>
                  <div className="header1-menu-cart-detail">
                    <small>MY CART</small>
                    <span>$ 0.00</span>
                  </div>
                </button>
                <button className="header1-menu header1-menu-toggle"><i></i></button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header1;
