import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import TextBox from '../../../Components/TextBox';

class HorizontalTab1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabMinWidth: 0,
      specialClass: '',
      animationClass: '',
      tabHover: false,
      tabActive: props.tabs[0].id,
      style: props.setting.tapHeaderStyle,
    };
  }

  componentDidMount() {
    this.calWidth(this.props.tabs.length, this.props.setting.sizeMinTab);
    window.addEventListener('resize', () => this.calWidth(this.props.tabs.length, this.props.setting.sizeMinTab));
  }

  componentWillReceiveProps(nextProps) {
    this.verifyActive(nextProps.tabs);
    this.calWidth(nextProps.tabs.length, nextProps.setting.sizeMinTab);
    this.setState({ style: nextProps.setting.tapHeaderStyle });
  }

  calWidth(length, minSize) {
    let tabMinWidth = (this.content.clientWidth / length);
    if (tabMinWidth < minSize) tabMinWidth = minSize;
    this.setState({ tabMinWidth }, () => {
      if ((this.state.tabMinWidth * length) > this.content.clientWidth) {
        this.setState({ specialClass: 'noneline' });
      } else {
        this.setState({ specialClass: '' });
      }
    });
  }

  verifyActive(tabs) {
    if (!tabs.find((x) => x.id === this.state.tabActive)) {
      this.setState({ tabActive: tabs[0].id });
    }
  }

  render() {
    const { id, title, tabs, setting, editMode } = this.props;

    const sectionTitle = setting.title ? (
      <div className="tabs-title">
        <TextBox
          id="horizontal-tab-title"
          editMode={editMode}
          sectionID={id}
          type="title"
        >{ title }</TextBox>
      </div>
    ) : null;

    const sectionTabs = (
      <ul className={`tabs-nav ${this.state.specialClass}`}>
        {
          tabs.map((x) => {
            let style = this.state.style.Normal;
            if (this.state.tabHover === x.id) style = this.state.style.Hover;
            if (this.state.tabActive === x.id) style = this.state.style.Active;

            return (
              <li
                key={`tab-${x.id}`}
                className={`${this.state.tabActive === x.id ? 'active' : ''}`}
                style={{ width: `${this.state.tabMinWidth}px` }}
              >
                <button
                  onClick={() => this.setState({ tabActive: x.id })}
                  onMouseEnter={() => this.setState({ tabHover: x.id })}
                  onMouseLeave={() => this.setState({ tabHover: false })}
                  style={style}
                ><b>{x.title}</b></button>
              </li>
            );
          })
        }
      </ul>
    );

    const sectionDescrip = (
      <div className={`tabs-descrip ${this.state.specialClass}`}>
        {
          tabs.map((x) => (
            <div
              key={`tabs-description-${x.id}`}
              className={`panel animated fadeInRight ${this.state.tabActive === x.id && 'current'}`}
            >
              <TextBox
                id={`horizontal-tab-description-${x.id}`}
                editMode={editMode}
                sectionID={id}
                type={`${x.id}`}
              >{ x.descrip }</TextBox>
            </div>
          ))
        }
      </div>
    );

    return (
      <div
        className="horizontal-tab-1"
        data-automation-id="section-horizontal-tab"
        data-automation-design="horizontal-tab-1"
        data-automation-section-id={id} // eslint-disable-line
        ref={(el) => { this.content = el; }}
      >
        { sectionTitle }
        { sectionTabs }
        { sectionDescrip }
      </div>
    );
  }
}

HorizontalTab1.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  tabs: PropTypes.array,
  setting: PropTypes.object,
  editMode: PropTypes.bool,
};

HorizontalTab1.defaultProps = {
  title: '',
  tabs: [],
  setting: {},
  editMode: false,
};

export default HorizontalTab1;
