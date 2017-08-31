import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid';
import TrashIcon from 'react-icons/lib/ti/trash';
import ChainIcon from 'react-icons/lib/fa/chain';
import AddIcon from 'react-icons/lib/fa/plus-square';

import styles from '../styles.css';

import Dialog from '../../../Dialog';
import ColorPicker from '../../../ColorPicker';
import { PositiveButton, NegativeButton } from '../../../Dialog/Buttons';

import { hideSettingPopup, changeSettingPopup } from '../../../../actions';

import { initailContent as initailContent3 } from '../../../../../Websites/Section/Project/Project3/initail';

class SettingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setupButtonLink: false,
      dataButtonID: null,
      dataButtonLink: null,
      dataButtonTarget: null,
      titleShow: false,
      titleBackground: '',
      widthImage: 0,
      hightImage: 0,
      projectList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === this.props.allowPopup &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false
    ) {
      this.setState({
        titleShow: nextProps.setting.title.show,
        titleBackground: nextProps.setting.title.backgroundColor,
        widthImage: nextProps.setting.imgSize.width,
        hightImage: nextProps.setting.imgSize.height,
        projectList: nextProps.data.projectList,
      });
    }
  }

  onSetupLink(data, index) {
    this.setState({
      setupButtonLink: true,
      dataButtonID: index,
      dataButtonLink: data.link.url,
      dataButtonTarget: data.link.target,
    });
  }

  onSaveButtonLink() {
    const projectList = this.state.projectList;
    projectList[this.state.dataButtonID].button.link = {
      ...projectList[this.state.dataButtonID].button.link,
      url: this.state.dataButtonLink,
      target: this.state.dataButtonTarget,
    };

    this.setState({
      setupButtonLink: false,
      dataButtonLink: null,
      dataButtonID: null,
      dataButtonTarget: null,
      projectList,
    });
  }

  onCancelButtonLink() {
    this.setState({
      setupButtonLink: false,
      dataButtonLink: null,
      dataButtonID: null,
      dataButtonTarget: null,
    });
  }

  addColum() {
    const projectList = this.state.projectList;
    const uniqueID = Math.max(...projectList.map((x) => x.id)) + 1;
    let init = { id: uniqueID };
    switch (this.props.popup) {
      case 'showSettingPopupProject3': init = { ...init, ...initailContent3 }; break;
      case 'showSettingPopupProject1': init = { ...init, ...initailContent3 }; break;
      default: break;
    }
    projectList.push(init);
    this.setState({ projectList });
  }

  removeColum(index) {
    const projectList = this.state.projectList;
    projectList.splice(index, 1);
    this.setState({ projectList });
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup, allowPopup } = this.props;
    return !this.state.setupButtonLink ? (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === allowPopup}
        contentStyle={{ width: '928px' }}
        bodyCustom={`${allowPopup}`}
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                title: {
                  ...this.props.setting.title,
                  show: this.state.titleShow,
                  backgroundColor: this.state.titleBackground,
                },
                imgSize: {
                  ...this.props.setting.imgSize,
                  width: this.state.widthImage,
                  height: this.state.hightImage,
                },
              },
              { ...this.props.data, projectList: this.state.projectList },
            )}
            className={styles.button}
          > Save </PositiveButton>,
          <NegativeButton onClick={() => onHideSettingPopup()}>Cancel</NegativeButton>,
        ]}
      >
        <div className={styles.container}>

          <Row className={styles.rows}>
            <Col xs={2}>
              <label htmlFor="label">Title show</label>
              <Checkbox
                label={this.state.titleShow ? 'On' : 'Off'}
                onCheck={() => this.setState({ titleShow: !this.state.titleShow })}
                checked={this.state.titleShow}
                className={styles.checked}
              />
            </Col>
            <Col xs={3}>
              <label htmlFor="label">Title background</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.titleBackground}
                    type="text"
                    name="titleBackground"
                    style={{ width: 150 }}
                    onChange={(ev) => this.setState({ titleBackground: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.titleBackground}
                    contentElement={`${allowPopup}`}
                    onUpdate={(color) => this.setState({ titleBackground: color })}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={7}>
              <label htmlFor="label">Image size</label>
              <Row middle="xs">
                <Col xs={6}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.widthImage}
                    type="number"
                    name="widthImage"
                    style={{ width: 150 }}
                    onChange={(ev) => this.setState({ widthImage: ev.target.value })}
                  />
                  <label className={styles.label} htmlFor="icon-size">Width <small>( px )</small></label>
                </Col>
                <Col xs={6}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.hightImage}
                    type="number"
                    name="hightImage"
                    style={{ width: 150 }}
                    onChange={(ev) => this.setState({ hightImage: ev.target.value })}
                  />
                  <label className={styles.label} htmlFor="icon-size">Height <small>( px )</small></label>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className={styles.hr} />

          <Row className={styles.rows}>
            {
              this.state.projectList.map((x, index) => (
                <Col xs={3} key={`setting-projectList-${x.id}`}>
                  <br />
                  <label htmlFor="label">Item {x.id}</label>
                  <div className={styles.tool} title="Link setup" style={{ marginLeft: 15, fontSize: 18 }}>
                    <ChainIcon className={styles.trashColor} onClick={() => this.onSetupLink(x.button, index)} />
                  </div>
                  { this.state.projectList.length > 1 &&
                    <div className={styles.tool} title="Remove" style={{ marginLeft: 15 }}>
                      <TrashIcon className={styles.trashColor} onClick={() => this.removeColum(index)} />
                    </div>
                  }
                </Col>
              ))
            }
            <Col xs={3}>
              <br />
              <div className={styles.toolsColum} style={{ paddingTop: 3 }}>
                <span style={{ fontSize: '2em' }}>
                  <AddIcon onClick={() => this.addColum()} />
                </span>
                <span style={{ paddingLeft: 5, fontSize: 13 }}>
                  ....New
                </span>
              </div>
            </Col>
          </Row>

        </div>
      </Dialog>
    ) : (
      <Dialog
        title="Link Setup"
        onClose={() => this.onCancelButtonLink()}
        open={Boolean(true)}
        contentStyle={{ width: '620px' }}
        actions={[
          <PositiveButton onClick={() => this.onSaveButtonLink()} className={styles.button}> Save </PositiveButton>,
          <NegativeButton onClick={() => this.onCancelButtonLink()}>Cancel</NegativeButton>,
        ]}
      >
        <div>

          <Row middle="md" className="padding-bottom">
            <Col md={2} xsOffset={1} className="text-center">URL</Col>
            <Col md={7}>
              <TextField
                className={styles.fieldStyles}
                value={this.state.dataButtonLink}
                type="text"
                name="button_url"
                style={{ width: '100%' }}
                onChange={(ev) => this.setState({ dataButtonLink: ev.target.value })}
              />
            </Col>
          </Row>

          <Row middle="md">
            <Col md={2} className="text-center" xsOffset={1}>Target</Col>
            <Col md={7}>
              <SelectField
                value={this.state.dataButtonTarget}
                className={styles.fieldStyles}
                fullWidth={Boolean(true)}
                onChange={(ev, index, value) => this.setState({ dataButtonTarget: value })}
              >
                <MenuItem value="_blank" primaryText="In new window/tab" />
                <MenuItem value="_parent" primaryText="In same window/tab" />
              </SelectField>
            </Col>
          </Row>

          <div className={styles.hr} />

          <Row>
            <Col xs={12} className={styles.note}>
              {
                `
                Note: To add external link, please include "http://" front of the link. For example, "http://external_website.com"
                To add internal link, please add the link part following "/". For example, "/internal_link.com"
                `
              }
            </Col>
          </Row>
        </div>
      </Dialog>
    );
  }
}

SettingPopup.propTypes = {
  popup: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  onHideSettingPopup: PropTypes.func.isRequired,
  onChangeSettingPopup: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  setting: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  allowPopup: PropTypes.string.isRequired,
};

const mapStateToProps = (reducer) => {
  const state = reducer.get('pageEditor');
  return {
    popup: state.get('popup'),
    data: state.get('settingPopupData') || false,
    setting: state.get('settingPopupSetting') || false,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onHideSettingPopup: () => dispatch(hideSettingPopup()),
  onChangeSettingPopup: (setting, data) => dispatch(changeSettingPopup(setting, data)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingPopup);
