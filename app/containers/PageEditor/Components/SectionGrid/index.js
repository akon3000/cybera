import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class SectionGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const style = {
      top: {
        borderTop: `1px dashed ${this.props.color}`,
        left: 0,
        right: 0,
        top: 0,
      },
      bottom: {
        borderBottom: `1px dashed ${this.props.color}`,
        left: 0,
        right: 0,
        bottom: -1,
      },
      left: {
        borderLeft: `1px dashed ${this.props.color}`,
        left: 0,
        top: 0,
        bottom: 0,
      },
      right: {
        borderRight: `1px dashed ${this.props.color}`,
        right: 0,
        top: 0,
        bottom: 0,
      },
    };
    return (
      <div style={style[this.props.option]} className={styles.sectionGrid}></div>
    );
  }
}

SectionGrid.propTypes = {
  option: PropTypes.string.isRequired,
  color: PropTypes.string,
};

SectionGrid.defaultProps = {
  color: 'rgba(24,185,226, 0.8)',
};

export default SectionGrid;
