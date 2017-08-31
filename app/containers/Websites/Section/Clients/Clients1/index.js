import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextBox from '../../../Components/TextBox';
import Image from '../../../Components/Image';

class Clients1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    };
  }

  render() {
    const { id, editMode, title, items, setting } = this.props;

    const sectionTitle = setting.title.show ? (
      <div style={{ backgroundColor: setting.title.backgroundColor }}>
        <TextBox
          id={`Clients-1-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{ title }</TextBox>
      </div>
    ) : null;

    const sectionImageList = (
      <div className="body-content">
        <div className="row-spacial">
          {
            items.map((x) => (
              <div
                key={`clients-image-list-1-${id}-${x.id}`}
                className="col-lg-3 col-md-4 col-sm-6 text-center"
              >
                <Image
                  key={`clients-image-list-1-${id}-${x.id}`}
                  editMode={editMode}
                  url={x.url}
                  id={x.id}
                  type="ImageClient"
                  sectionID={id}
                  link={x.link}
                  width={`${setting.imgSize.width}px`}
                  height={`${setting.imgSize.height}px`}
                  style={{
                    overflow: 'hidden',
                    borderRadius: '50%',
                    display: 'inline-block',
                    margin: '20px 0',
                  }}
                  className={`${!x.url ? 'component-image-default-logo' : ''}`}
                  imageStyle={{ width: '100%', maxHeight: 'none', height: '100%' }}
                  deletable={x.url !== null}
                />
              </div>
            ))
          }
        </div>
      </div>
    );

    return (
      <div
        className="clients-1"
        data-automation-id="section-client"
        data-automation-design="client-1"
        data-automation-section-id={id} // eslint-disable-line
      >
        { sectionTitle }
        { sectionImageList }
      </div>
    );
  }
}

Clients1.propTypes = {
  editMode: PropTypes.bool,
  id: PropTypes.number,
  title: PropTypes.string,
  items: PropTypes.array,
  setting: PropTypes.object,
};

Clients1.defaultProps = {
  id: null,
  editMode: false,
  title: 'SECTION TITLE',
  items: [],
  setting: {},
};

export default Clients1;
