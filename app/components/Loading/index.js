import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconLoading from 'react-icons/lib/fa/spinner';

import styles from './styles.css';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={`${styles.loading} ${this.props.inside && styles.inside}`}><IconLoading /></div>
    );
  }
}

Loading.propTypes = {
  inside: PropTypes.bool,
};

Loading.defaultProps = {
  inside: false,
};

export default Loading;
