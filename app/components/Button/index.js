import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const onMouseUp = () => {
      this.button.blur();
      if (this.props.onMouseUp != null) this.props.onMouseUp();
    };
    const buttonProps = Object.assign({}, this.props);
    delete buttonProps.btnStyle;
    delete buttonProps.children;
    delete buttonProps.onMouseUp;
    return (
      <button
        ref={(button) => { this.button = button; }}
        onMouseUp={onMouseUp}
        {...buttonProps}
        className={`${styles.btn} ${styles[this.props.btnStyle]} ${this.props.className}`}
      >
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  btnStyle: PropTypes.string,
  onMouseUp: PropTypes.func,
};

Button.defaultProps = {
  children: null,
  className: '',
  btnStyle: 'positive',
  onMouseUp: null,
};

export default Button;
