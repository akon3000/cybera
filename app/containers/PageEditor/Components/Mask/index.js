import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './styles.css';

import { selectSection } from '../../actions';

const Mask = ({ sectionID, onSelectSection }) => <button className={styles.mask} onClick={() => onSelectSection(sectionID)}></button>;

Mask.propTypes = {
  sectionID: PropTypes.number.isRequired,
  onSelectSection: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onSelectSection: (sectionID) => dispatch(selectSection(sectionID)),
  };
}

export default connect(null, mapDispatchToProps)(Mask);
