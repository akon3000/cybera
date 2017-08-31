import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Image from '../../../Components/Image';
import TextBox from '../../../Components/TextBox';

class Testimonials1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, setting, title, testimonialsList } = this.props;

    const sectionTitle = setting.title.show ? (
      <div
        className="title-content"
        style={{ backgroundColor: setting.title.backgroundColor }}
      >
        <TextBox
          id={`testimonials-1-title-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{ title }</TextBox>
      </div>
    ) : null;

    const sectionTestimonialList = (
      <div className="body-content">
        <div className="row-spacial">
          {
            testimonialsList.map((x) => (
              <div
                key={`testimonials-list-1-${id}-${x.id}`}
                className="col-md-4 col-sm-12 padding-top"
              >
                <div className="text-center padding-top">
                  <Image
                    key={`testimonials-list-1-image-${id}-${x.id}`}
                    editMode={editMode}
                    url={x.image.url}
                    width={`${setting.imgSize.width}px`}
                    height={`${setting.imgSize.height}px`}
                    id={x.id}
                    type="testimonialsList"
                    sectionID={id}
                    link={x.image.link}
                    deletable={x.image.url !== null}
                    style={{
                      overflow: 'hidden',
                      borderRadius: '50%',
                      display: 'inline-block',
                      backgroundSize: `${setting.imgSize.width - 30}px ${setting.imgSize.height - 30}px`,
                    }}
                    imageStyle={{ width: '100%', maxHeight: 'none', height: '100%' }}
                    className={`${!x.image.url ? 'component-image-default-user' : ''}`}
                  />
                </div>
                <TextBox
                  key={`testimonials-list-1-content-${id}-${x.id}`}
                  id={`testimonials-list-1-content-${id}-${x.id}`}
                  editMode={editMode}
                  sectionID={id}
                  type="testimonialsList"
                >{ x.content }</TextBox>
              </div>
            ))
          }
        </div>
      </div>
    );

    return (
      <div
        className="testimonials-1"
        data-automation-id="section-testimonials"
        data-automation-design="testimonials-1"
        data-automation-section-id={id}
      >
        { sectionTitle }
        { sectionTestimonialList }
      </div>
    );
  }
}

Testimonials1.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  setting: PropTypes.object,
  title: PropTypes.string,
  testimonialsList: PropTypes.array,
};

Testimonials1.defaultProps = {
  editMode: false,
  setting: {},
  title: '',
  testimonialsList: [],
};

export default Testimonials1;
