import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FullScreenIcon from 'react-icons/lib/go/screen-full';
import NormalScreenIcon from 'react-icons/lib/go/screen-normal';

import Button from '../../../Button';

class ButtonFluid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { fluid, onFluid } = this.props;
    return (
      <Button
        onClick={() => onFluid(!fluid)}
        title={fluid ? 'Normal screen' : 'Full screen'}
        icon={fluid ? <NormalScreenIcon /> : <FullScreenIcon />}
      />
    );
  }
}

ButtonFluid.propTypes = {
  fluid: PropTypes.bool.isRequired,
  onFluid: PropTypes.func.isRequired,
};

export default ButtonFluid;
