import React from 'react';
import PropTypes from 'prop-types';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';

import styles from './styles.css';

class SlideBox extends React.Component {
  constructor(props) {
    super(props);

    const itemPerPage = props.itemPerPage;
    const numberOfPage = Math.ceil(props.children.length / itemPerPage);
    this.state = {
      acitveItem: 0,
      items: props.children,
      itemPerPage,
      numberOfPage,
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.slicedItems();
  }

  slideLeft() {
    if (this.state.currentPage > 1) {
      this.setState({ currentPage: this.state.currentPage - 1 }, () => {
        this.slicedItems();
      });
    }
  }

  slideRight() {
    if (this.state.currentPage <= this.state.numberOfPage) {
      this.setState({ currentPage: this.state.currentPage + 1 }, () => {
        this.slicedItems();
      });
    }
  }

  slicedItems() {
    let startIndex = (this.state.currentPage - 1) * this.state.itemPerPage;
    let endIndex = startIndex + this.state.itemPerPage;
    if (endIndex > this.state.items.length) {
      endIndex = this.state.items.length;
    }

    startIndex = endIndex - this.state.itemPerPage;
    this.setState({ startIndex, endIndex });
  }

  render() {
    let slideIndex = 0;

    return (
      <div data-automation-id={this.props['data-automation-id']} className={`${styles.containers} ${this.props.className}`}>
        {this.state.items.slice(this.state.startIndex, this.state.endIndex).map((items) => {
          slideIndex += 1;
          return (<div key={`slide_${slideIndex}`} className={styles.itemBox} style={{ width: `${(100 / this.state.itemPerPage)}%` }}>
            {items}
          </div>);
        }
        )}
        <button
          data-automation-id="btn-slide-left"
          disabled={this.state.currentPage === 1}
          className={styles.slideLeft}
          onClick={() => this.slideLeft()}
        >
          <LeftIcon />
        </button>
        <button
          data-automation-id="btn-slide-right"
          disabled={this.state.currentPage >= this.state.numberOfPage}
          className={styles.slideRight}
          onClick={() => this.slideRight()}
        >
          <RightIcon />
        </button>
      </div>
    );
  }
}

SlideBox.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  itemPerPage: PropTypes.number,
  'data-automation-id': PropTypes.string,
};

SlideBox.defaultProps = {
  className: null,
  itemPerPage: 1,
  'data-automation-id': '',
};

export default SlideBox;
