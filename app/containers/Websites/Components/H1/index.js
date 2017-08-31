import React from 'react';
import PropTypes from 'prop-types';

class H1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<h1>{this.props.children}</h1>);
  }
}

H1.propTypes = {
  children: PropTypes.node.isRequired,
};

H1.defaultProps = {};

export default H1;
