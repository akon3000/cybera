import React from 'react';
import PropTypes from 'prop-types';

import NavIconActive from 'react-icons/lib/md/radio-button-checked';
import NavIcon from 'react-icons/lib/md/lens';

import Image from '../../../Components/Image';

import './styles.css';

class ImageSlider1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: Math.floor(props.items.length / 2),
      width: 1900,
      height: 900,
      loopTime: 3000,
    };
  }

  componentDidMount() {
    this.calculatorSize();
    if (!this.props.editMode && this.props.items.length > 1) {
      setInterval(() => {
        this.forward();
      }, this.state.loopTime);
    }
  }

  componentWillReceiveProps(preProps) {
    if (preProps.items.length > this.props.items.length) {
      this.setState({ activeIndex: preProps.items.length - 1 });
    } else {
      this.setState({ activeIndex: Math.floor(this.props.items.length / 2) });
    }
  }

  goto(index) {
    this.setState({ activeIndex: index });
  }

  forward() {
    const total = this.props.items.length;
    if (this.state.activeIndex < total - 1) {
      this.goto(this.state.activeIndex + 1);
    } else {
      this.goto(0);
    }
  }

  back() {
    const total = this.props.items.length;
    if (this.state.activeIndex > 0) {
      this.goto(this.state.activeIndex - 1);
    } else {
      this.goto(total - 1);
    }
  }

  calculatorSize() {
    const height = (window.outerWidth * this.state.height) / this.state.width;
    this.setState({ height, width: window.outerWidth });
  }

  render() {
    const { width, height } = this.state;
    const { id, items, editMode } = this.props;

    return (
      <div
        className="imageSlider1"
        data-automation-id="section-image-slider"
        data-automation-design="image-slider-1"
        data-automation-section-id={id}
      >
        <div className="imageSlide1-items-container" style={{ height: `${height}px` }}>
          { items.map((item, key) =>
            <div
              key={`imageSlide1-items-${item.id}`}
              className={`imageSlide1-items animate-opacity ${this.state.activeIndex === key ? 'show' : 'hide'}`}
            ><Image
              editMode={editMode}
              url={item.backgroundImage}
              width={`${width}px`}
              height={`${height}px`}
              type="items"
              id={item.id}
              sectionID={id}
              link={item.link}
              deletable={items.length > 1}
            /></div>)
          }
        </div>
        { items.length > 1 &&
          <div>
            <div className="imageSlider1-navigator-container">
              {items.map((item, key) =>
                <button
                  key={`imageSlide1-items-navigator-${item.id}`}
                  className={`imageSlider1-navigator ${this.state.activeIndex === key && 'active'}`}
                  onClick={() => {
                    this.goto(key);
                  }}
                >
                  {this.state.activeIndex === key && <NavIconActive />}
                  {this.state.activeIndex !== key && <NavIcon />}
                </button>)}
            </div>

            <button className="imageSlider1-back" onClick={() => this.back()}><i></i></button>
            <button className="imageSlider1-forward" onClick={() => this.forward()}><i></i></button>
          </div>
        }
      </div>
    );
  }
}

ImageSlider1.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool.isRequired,
  items: PropTypes.array,
};

ImageSlider1.defaultProps = {
  onImageChange: () => {},
  items: [],
};

export default ImageSlider1;
