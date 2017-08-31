import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';

class Switch extends Component { // eslint-disable-line

  render() {
    const { input, label, onToggle, disabled, defaultToggled, meta: { touched, error, warning } } = this.props; // eslint-disable-line
    return (
      <Toggle
        {...input}
        label={label}
        defaultToggled={defaultToggled}
        onToggle={onToggle}
        disabled={disabled}
      />
    );
  }

}

export default Switch;
