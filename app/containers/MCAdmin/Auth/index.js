import React from 'react';
// import PropTypes from 'prop-types';

import LoginPopup from '../../Auth/LoginPopup';

class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (<div>
      <LoginPopup />
    </div>);
  }
}

export default Auth;
