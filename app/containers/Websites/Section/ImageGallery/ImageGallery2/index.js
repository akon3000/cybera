import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Image from '../../../Components/Image';
import H1 from '../../../Components/H1';
import TextBox from '../../../Components/TextBox';

class ImageGallery2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [

      ],
    };
  }

  render() {
    const { id } = this.props;
    return (
      <div
        className="image-gallery-2"
        data-automation-id="section-image-gallery"
        data-automation-design="image-gallery-2"
        data-automation-section-id={id}
      >
        {this.props.title && <H1>{this.props.title}</H1>}
        {this.props.description && <TextBox>{this.props.description}</TextBox>}
        <div className="image-gallery-2-items-container">
          {this.props.items.map((item) => <Image key={`image-gallery-2-${this.props.id}-${item.id}`} url={item.url} className="image-gallery-2-items" />)}
        </div>
      </div>
    );
  }
}

ImageGallery2.propTypes = {
  id: PropTypes.number.isRequired,
  items: PropTypes.array,
  title: PropTypes.string,
  description: PropTypes.string,
};

ImageGallery2.defaultProps = {
  items: [],
  title: '',
  description: '',
};

export default ImageGallery2;
