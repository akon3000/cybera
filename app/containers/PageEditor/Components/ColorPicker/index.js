import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';

import styles from './styles.css';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.color,
      showPicker: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ color: nextProps.color });
  }

  componentDidUpdate() {
    if (this.picker) {
      const contentElement = document.getElementsByClassName(this.props.contentElement)[0];
      // const target = this.colorPicker.getBoundingClientRect();
      this.picker.style.top = `${(this.colorPicker.offsetTop - contentElement.scrollTop) - (this.picker.clientHeight / 2)}px`;
      this.picker.style.left = `${this.colorPicker.offsetLeft + 80}px`;
    }
  }

  showPicker() {
    return (
      <div className={styles.containerPicker}>
        <div
          className={styles.picker}
          ref={(el) => { this.picker = el; }}
        >
          <ChromePicker
            color={this.state.color}
            onChangeComplete={(color) => this.props.onUpdate(color.hex)}
          />
        </div>
        <button
          className={styles.dummyBox}
          onClick={() => this.setState({ showPicker: false })}
        ></button>
      </div>
    );
  }

  render() {
    return (
      <div
        className={styles.boxContent}
        ref={(el) => { this.colorPicker = el; }}
      >
        <button
          className={styles.box}
          style={{ backgroundColor: this.state.color }}
          onClick={() => this.setState({ showPicker: true })}
        ></button>
        <div>
          { this.state.showPicker && this.showPicker()}
        </div>
      </div>
    );
  }
}

ColorPicker.propTypes = {
  color: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  contentElement: PropTypes.string.isRequired,
};

ColorPicker.defaultProps = {
  color: '#FFF',
};

export default ColorPicker;
