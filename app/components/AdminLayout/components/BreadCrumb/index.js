import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

function BreadCrumb(props) {
  let breadCrumbs = [];
  for (let i = 0; i < props.breadCrumb.length; i += 1) {
    breadCrumbs.push(props.breadCrumb[i]);
    breadCrumbs.push(<span key={`slash_${i}`}>/</span>);
  }

  breadCrumbs = breadCrumbs.splice(0, breadCrumbs.length - 1);

  return (<div className={styles.container}>
    <div className={styles.breadCrumb}>
      {breadCrumbs}
    </div>
  </div>);
}

BreadCrumb.propTypes = {
  breadCrumb: PropTypes.array.isRequired,
};

export default BreadCrumb;
