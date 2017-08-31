import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Image from '../../../Components/Image';
import TextBox from '../../../Components/TextBox';

class MeetTheTeam5 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, setting, title, teamList } = this.props;

    const sectionTitle = setting.title.show ? (
      <div style={{ backgroundColor: setting.title.backgroundColor }}>
        <TextBox
          id={`meet-the-team-5-title-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{title}</TextBox>
      </div>
    ) : null;

    const sectionBody = (
      <div className="body-content">
        {
          teamList.map((x, index) => (
            <div
              key={`meet-the-team-5-row-${id}-${x.id}`}
              className="row-spacial padding-top padding-bottom"
            >
              <div
                className={`col-md-7 col-sm-12 align-self-center text-center ${((index + 1) % 2) !== 0 ? 'flex-md-first flex-sm-first' : 'flex-md-last flex-sm-first'}`}
              >
                <Image
                  key={`meet-the-team-5-${id}-${x.id}`}
                  editMode={editMode}
                  url={x.url}
                  width={`${setting.imgSize.width}px`}
                  height={`${setting.imgSize.height}px`}
                  id={x.id}
                  type="teamList"
                  sectionID={id}
                  link={x.link}
                  deletable={x.url !== null}
                  className={`${!x.url ? 'component-image-default-user' : ''}`}
                  style={{
                    overflow: 'hidden',
                    display: 'inline-block',
                    backgroundSize: `${setting.imgSize.width > 180 ? 150 : setting.imgSize.width - 30}px ${setting.imgSize.height > 180 ? 150 : setting.imgSize.height - 30}px`,
                  }}
                  imageStyle={{ width: '100%', minHeight: '100%', maxHeight: 'none' }}
                />
              </div>
              <div
                className={`col-md-5 col-sm-12 align-self-center text-sm-center ${((index + 1) % 2) !== 0 ? 'flex-md-last text-md-left' : 'flex-md-first text-md-right'}`}
              >
                <TextBox
                  key={`meet-the-team-5-teamList-${id}-${x.id}`}
                  id={`meet-the-team-5-teamList-${id}-${x.id}`}
                  editMode={editMode}
                  sectionID={id}
                  type="teamList"
                >{x.descrip}</TextBox>
              </div>
            </div>
          ))
        }
      </div>
    );

    return (
      <div
        className="meet-the-team-5"
        data-automation-id="section-meet-the-team"
        data-automation-design="meet-the-team-5"
        data-automation-section-id={id}
      >
        { sectionTitle }
        { sectionBody }
      </div>
    );
  }
}

MeetTheTeam5.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  teamList: PropTypes.array,
  editMode: PropTypes.bool,
  setting: PropTypes.object,
};

MeetTheTeam5.defaultProps = {
  title: '',
  teamList: [],
  editMode: false,
  setting: {},
};

export default MeetTheTeam5;
