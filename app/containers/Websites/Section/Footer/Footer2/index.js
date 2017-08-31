import React from 'react';

import './styles.css';

class Footer2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer
        className="footer2 row"
        data-automation-id="section-footer"
        data-automation-design="footer-2"
        data-automation-section-id={id} // eslint-disable-line
      >
        <div className="footer2-navigator">
          <button>Home</button>
          <button>About Us</button>
          <button>Delivery Information</button>
          <button>Privacy Policy</button>
          <button>Terms & Conditions</button>
        </div>
        <div className="row footer2-copyright">
          © {new Date().getFullYear()} Cybera All rights reserved.
        </div>
      </footer>
    );
  }
}

export default Footer2;
