import React from 'react';
import PropTypes from 'prop-types';

import PopoverMaterial from 'material-ui/Popover/Popover';

import styles from './styles.css';

class Popover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children, ...popoverProps } = this.props;
    return (
      <PopoverMaterial
        {...popoverProps}
        className={styles.container}
        // zDepth={1300}
        overlayStyle={{ zIndex: 1300 }}
      >
        <div className={styles.children}>
          <div className={styles.inner}>
            {children}
          </div>
        </div>
      </PopoverMaterial>
    );
  }
}

Popover.propTypes = {
  children: PropTypes.node,
};

Popover.defaultProps = {
  children: <div>Popover</div>,
};

export default Popover;
