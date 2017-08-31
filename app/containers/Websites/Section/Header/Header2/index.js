import React from 'react';

import Image from '../../../Components/Image';

import './styles.css';

class Header2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <header
        className="header2 row"
        data-automation-id="section-header"
        data-automation-design="header-2"
        data-automation-section-id={id} // eslint-disable-line
      >
        <div className="header2-sub-header">
          <div className="container">
            <button>My Account</button>
            <button>Wish List</button>
            <button>Shopping</button>
            <button>Cart Checkout</button>
          </div>
        </div>
        <div className="header2-main-header">
          <div className="container">
            <div className="header2-main-header-left">
              <Image
                url="http://i36.photobucket.com/albums/e47/nantawatcybera/template2-logo_zps0ywuklay.png"
                alt="logo"
                style={{ margin: '21px 0' }}
                sectionID={2}
                editMode={false}
              />
            </div>
            <div className="header2-main-header-center">
              <button>Home</button>
              <button>Features</button>
              <button>Collections</button>
              <button>Blogs</button>
              <button>About Us</button>
              <button>Contact Us</button>
            </div>
            <div className="header2-main-header-right">
              <button className="menu-icons menu-icons-account"><i></i></button>
              <button className="menu-icons menu-icons-cart">
                <i></i>
                <small>0</small>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header2;
