import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './rootStyles1.css';

import Image from '../../Components/Image';
import TextBox from '../../Components/TextBox';

class RootProject1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, projectList, title, setting, designNumber } = this.props;

    const sectionTitle = setting.title.show ? (
      <div className="title-content" style={{ backgroundColor: setting.title.backgroundColor }}>
        <TextBox
          id={`project-3-title-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{title}</TextBox>
      </div>
    ) : null;

    const sectionProjectList = (
      <div className="body-content">
        {
          projectList.map((x, index) => {
            const condition = ((index + 1) % 2) !== 0;
            return (
              <div className="row-spacial" key={`project-${designNumber}-row-${x.id}`}>
                <div className={`padding-none col-md-6 col-sm-12 align-self-center ${condition && designNumber === '3' ? 'flex-md-last flex-sm-last' : 'flex-md-first flex-sm-last'}`}>
                  <Image
                    key={`project-${designNumber}-${id}-${x.id}`}
                    editMode={editMode}
                    url={x.image.url}
                    width={`${setting.imgSize.width}px`}
                    height={`${setting.imgSize.height}px`}
                    id={x.id}
                    type="projectList"
                    sectionID={id}
                    link={x.image.link}
                    deletable={x.image.url !== null}
                    style={{ overflow: 'hidden' }}
                    imageStyle={{ width: '100%', maxHeight: 'none', minHeight: '100%' }}
                  />
                </div>
                <div className={`padding-none col-md-6 col-sm-12 align-self-center ${condition && designNumber === '3' ? 'flex-md-first' : 'flex-md-last'}`}>
                  <div className="box text-center">
                    <TextBox
                      key={`project-${designNumber}-projectList-content-${id}-${x.id}`}
                      id={`project-${designNumber}-projectList-content-${id}-${x.id}`}
                      editMode={editMode}
                      sectionID={id}
                      type="contentList"
                    >{x.content}</TextBox>
                    <br />
                    <a href={x.button.link.url} target={x.button.link.target} className="button" style={setting.buttonStyle.Normal}>
                      <TextBox
                        key={`project-${designNumber}-projectList-button-${id}-${x.id}`}
                        id={`project-${designNumber}-projectList-button-${id}-${x.id}`}
                        editMode={editMode}
                        sectionID={id}
                        type="buttonList"
                      >{x.button.content}</TextBox>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );

    return (
      <div
        className={`project-${designNumber}`}
        data-automation-id="project"
        data-automation-design={`project-${designNumber}`}
        data-automation-section-id={id}
      >
        { sectionTitle }
        { sectionProjectList }
      </div>
    );
  }
}

RootProject1.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  projectList: PropTypes.array,
  title: PropTypes.string,
  setting: PropTypes.object,
  designNumber: PropTypes.string.isRequired,
};

RootProject1.defaultProps = {
  projectList: [],
  editMode: false,
  title: '',
  setting: {},
};

export default RootProject1;
