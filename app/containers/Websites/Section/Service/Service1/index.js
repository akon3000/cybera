import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Image from '../../../Components/Image';
import TextBox from '../../../Components/TextBox';

class Service1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, serviceList, setting } = this.props;

    const sectionServiceList = (
      <div className="body-content">
        <div className="row-spacial padding-bottom padding-top">
          {
            serviceList.map((x) => (
              <div
                key={`service-1-col-${id}-${x.id}`}
                className="col-md-6 col-sm-12 padding-bottom padding-top"
              >
                <TextBox
                  key={`service-1-serviceList-title-${id}-${x.id}`}
                  id={`service-1-serviceList-title-${id}-${x.id}`}
                  editMode={editMode}
                  sectionID={id}
                  type="titleList"
                >{x.title}</TextBox>
                <div className="row-spacial">
                  <div className="col-md-5 col-sm-12 align-self-center">
                    <Image
                      key={`service-1-${id}-${x.id}`}
                      editMode={editMode}
                      url={x.image.url}
                      width={`${setting.imgSize.width}px`}
                      height={`${setting.imgSize.height}px`}
                      id={x.id}
                      type="serviceList"
                      sectionID={id}
                      link={x.image.link}
                      deletable={x.image.url !== null}
                      style={{ overflow: 'hidden' }}
                      imageStyle={{ width: '100%', maxHeight: 'none', minHeight: '100%' }}
                    />
                    <br />
                  </div>
                  <div className="col-md-7 col-sm-12 align-self-center">
                    <div className="box">
                      <TextBox
                        key={`service-1-serviceList-content-${id}-${x.id}`}
                        id={`service-1-serviceList-content-${id}-${x.id}`}
                        editMode={editMode}
                        sectionID={id}
                        type="contentList"
                      >{x.content}</TextBox>
                      <br />
                      <a href={x.button.link.url} target={x.button.link.target} className="button" style={setting.buttonStyle.Normal}>
                        <TextBox
                          key={`service-1-serviceList-button-${id}-${x.id}`}
                          id={`service-1-serviceList-button-${id}-${x.id}`}
                          editMode={editMode}
                          sectionID={id}
                          type="buttonList"
                        >{x.button.content}</TextBox>
                      </a>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );

    return (
      <div
        className="service-1"
        data-automation-id="service"
        data-automation-design="service-1"
        data-automation-section-id={id}
      >
        { sectionServiceList }
      </div>
    );
  }
}

Service1.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  setting: PropTypes.object,
  serviceList: PropTypes.array,
};

Service1.defaultProps = {
  editMode: false,
  setting: {},
  serviceList: [],
};

export default Service1;
