import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Image from '../../../Components/Image';
import H1 from '../../../Components/H1';
import TextBox from '../../../Components/TextBox';

class ImageGallery1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, title, description, editMode, items } = this.props;
    return (
      <div
        className="image-gallery-1"
        data-automation-id="section-image-gallery"
        data-automation-design="image-gallery-1"
        data-automation-section-id={id}
      >
        {title && <H1>{title}</H1>}
        {description &&
          <TextBox
            id={`image-gallery-1-${id}`}
            editMode={editMode}
            type="description"
            sectionID={id}
          >{description}</TextBox>}
        <div className="image-gallery-1-items-container">
          {items.map((item) =>
            <div key={`image-gallery-1-${item.id}`} className="image-gallery-1-items">
              <Image
                key={`image-gallery-1-${id}-${item.id}`}
                editMode={editMode}
                url={item.url}
                width={`${290}px`}
                height={`${150}px`}
                id={item.id}
                type="ImageGallery"
                sectionID={id}
                link={item.link}
                deletable={items.length > 1}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

ImageGallery1.propTypes = {
  editMode: PropTypes.bool,
  id: PropTypes.number.isRequired,
  items: PropTypes.array,
  title: PropTypes.string,
  description: PropTypes.string,
};

ImageGallery1.defaultProps = {
  editMode: false,
  items: [],
  title: '',
  description: '',
};

export default ImageGallery1;
