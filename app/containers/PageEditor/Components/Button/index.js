import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { icon, text, className, ...otherProps } = this.props;
    return (
      <button
        className={`${styles.btn} ${className} ${(icon !== undefined && text !== undefined ? styles.both : '')}`}
        // onClick={(event) => this.props.onClick(event)}
        // onClick={onClick}
        {...otherProps}
      >
        {icon} {text && <span>{text}</span>}
      </button>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.object,
  className: PropTypes.string,
};

Button.defaultProps = {
  icon: undefined,
  text: undefined,
  onClick: () => {},
  className: '',
};

export default Button;
