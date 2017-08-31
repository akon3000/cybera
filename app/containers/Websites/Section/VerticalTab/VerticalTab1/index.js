import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import TextBox from '../../../Components/TextBox';

class VerticalTab1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: props.tabs[0].id,
      tabHover: false,
      style: props.setting.tabStyle,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ style: nextProps.setting.tabStyle });
  }

  render() {
    const { id, setting, title, tabs, editMode } = this.props;

    const sectionTitle = setting.title ? (
      <div className="tabs-title">
        <TextBox
          id="vertical-tab-title"
          editMode={editMode}
          sectionID={id}
          type="title"
        >{ title }</TextBox>
      </div>
    ) : null;

    const sectionTabs = (
      <div className="tabs-content">
        <div className="tabs-nav" style={{ minWidth: `${setting.sizeMinTab}px` }}>
          {
            tabs.map((x) => {
              let style = this.state.style.Normal;
              if (this.state.tabHover === x.id) style = this.state.style.Hover;
              if (this.state.tabActive === x.id) style = this.state.style.Active;
              return (
                <button
                  key={`tab-vertical-${x.id}`}
                  onClick={() => this.setState({ tabActive: x.id })}
                  onMouseEnter={() => this.setState({ tabHover: x.id })}
                  onMouseLeave={() => this.setState({ tabHover: false })}
                  className={`tab ${x.id === this.state.tabActive && 'active'}`}
                  style={style}
                >
                  <b>{x.title}</b>
                  { x.id === this.state.tabActive &&
                    <div className="clear-active"></div>
                  }
                </button>
              );
            })
          }
        </div>
        <div className="tabs-descrip" style={{ height: `${setting.sizeMaxHeight}px` }}>
          {
            tabs.map((x) => (
              <div
                key={`tabs-description-${x.id}`}
                className={`panel animated fadeInRight ${this.state.tabActive === x.id && 'current'}`}
              >
                <TextBox
                  id={`vertical-tab-description-${x.id}`}
                  editMode={editMode}
                  sectionID={id}
                  type={`${x.id}`}
                >{ x.descrip }</TextBox>
              </div>
            ))
          }
        </div>
      </div>
    );

    return (
      <div
        className="vertical-tab-1"
        data-automation-id="section-vertical-tab"
        data-automation-design="vertical-tab-1"
        data-automation-section-id={id}
        ref={(el) => { this.content = el; }}
      >
        { sectionTitle }
        { sectionTabs }
      </div>
    );
  }
}

VerticalTab1.propTypes = {
  id: PropTypes.number.isRequired,
  tabs: PropTypes.array,
  title: PropTypes.string,
  setting: PropTypes.object,
  editMode: PropTypes.bool,
};

VerticalTab1.defaultProps = {
  title: '',
  tabs: [],
  setting: {},
  editMode: false,
};

export default VerticalTab1;
