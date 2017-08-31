import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

class ImageSlider2 extends React.Component {
  constructor(props) {
    super(props);
    const items = props.items;
    this.state = {
      items,
      total: items.length,
      activeIndex: Math.floor(items.length / 2),
    };
  }

  goto(index) {
    this.setState({ activeIndex: index });
  }

  forward() {
    if (this.state.activeIndex < this.state.total - 1) {
      this.goto(this.state.activeIndex + 1);
    } else {
      this.goto(0);
    }
  }

  back() {
    if (this.state.activeIndex > 0) {
      this.goto(this.state.activeIndex - 1);
    } else {
      this.goto(this.state.total - 1);
    }
  }

  render() {
    const { id } = this.props;
    return (
      <div
        className="ImageSlider2"
        data-automation-id="section-image-slider"
        data-automation-design="image-slider-2"
        data-automation-section-id={id}
      >
        {this.state.items.map((item, key) =>
          <div key={`imageSlide1-items-${item.id}`} className={`imageSlide1-items animate-opacity ${this.state.activeIndex === key ? 'show' : 'hide'}`} style={{ backgroundImage: `url(${item.backgroundImage})` }}></div>)}
        <div className="ImageSlider2-navigator-container">
          {this.state.items.map((item, key) =>
            <button
              key={`imageSlide1-items-navigator-${item.id}`}
              className={`ImageSlider2-navigator ${this.state.activeIndex === key && 'active'}`}
              onClick={() => {
                this.goto(key);
              }}
            >
              <span></span>
            </button>)}
        </div>
        <button className="ImageSlider2-back" onClick={() => this.back()}><i></i></button>
        <button className="ImageSlider2-forward" onClick={() => this.forward()}><i></i></button>
      </div>
    );
  }
}

ImageSlider2.propTypes = {
  id: PropTypes.number.isRequired,
  items: PropTypes.array,
};

ImageSlider2.defaultProps = {
  items: [],
};

export default ImageSlider2;
