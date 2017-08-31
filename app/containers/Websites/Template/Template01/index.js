import React from 'react';
import PropTypes from 'prop-types';

import '../global.css';
import './styles.css';

class Template extends React.Component {
  state = {}
  render() {
    return (
      <div className="template1">
        {this.props.children}
      </div>
    );
  }
}

Template.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Template;
