import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid';
import TrashIcon from 'react-icons/lib/ti/trash';
import ChainIcon from 'react-icons/lib/fa/chain';
import AddIcon from 'react-icons/lib/fa/plus-square';

import styles from '../styles.css';

import Dialog from '../../../Dialog';
import { PositiveButton, NegativeButton } from '../../../Dialog/Buttons';
import { hideSettingPopup, changeSettingPopup } from '../../../../actions';

import { initailContent as initailContent1 } from '../../../../../Websites/Section/Service/Service1/initail';

class SettingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setupButtonLink: false,
      dataButtonID: null,
      dataButtonLink: null,
      dataButtonTarget: null,
      widthImage: 0,
      hightImage: 0,
      serviceList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === 'showSettingPopupService1' &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false
    ) {
      this.setState({
        widthImage: nextProps.setting.imgSize.width,
        hightImage: nextProps.setting.imgSize.height,
        serviceList: nextProps.data.serviceList,
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
    const serviceList = this.state.serviceList;
    serviceList[this.state.dataButtonID].button.link = {
      ...serviceList[this.state.dataButtonID].button.link,
      url: this.state.dataButtonLink,
      target: this.state.dataButtonTarget,
    };

    this.setState({
      setupButtonLink: false,
      dataButtonLink: null,
      dataButtonID: null,
      dataButtonTarget: null,
      serviceList,
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
    const serviceList = this.state.serviceList;
    const uniqueID = Math.max(...serviceList.map((x) => x.id)) + 1;
    let init = { id: uniqueID };
    switch (this.props.popup) {
      case 'showSettingPopupService1': init = { ...init, ...initailContent1 }; break;
      default: break;
    }
    serviceList.push(init);
    this.setState({ serviceList });
  }

  removeColum(index) {
    const serviceList = this.state.serviceList;
    serviceList.splice(index, 1);
    this.setState({ serviceList });
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup } = this.props;
    return !this.state.setupButtonLink ? (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === 'showSettingPopupService1'}
        contentStyle={{ width: '928px' }}
        bodyCustom="showSettingPopupService1"
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                imgSize: {
                  ...this.props.setting.imgSize,
                  width: this.state.widthImage,
                  height: this.state.hightImage,
                },
              },
              { ...this.props.data, serviceList: this.state.serviceList },
            )}
            className={styles.button}
          > Save </PositiveButton>,
          <NegativeButton onClick={() => onHideSettingPopup()}>Cancel</NegativeButton>,
        ]}
      >
        <div className={styles.container}>

          <Row className={styles.rows}>
            <Col xs={10}>
              <label htmlFor="label">Image size</label>
              <Row middle="xs">
                <Col xs={6}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.widthImage}
                    type="number"
                    name="widthImage"
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
              this.state.serviceList.map((x, index) => (
                <Col xs={3} key={`setting-serviceList-${x.id}`}>
                  <br />
                  <label htmlFor="label">Item {x.id}</label>
                  <div className={styles.tool} title="Link setup" style={{ marginLeft: 15, fontSize: 18 }}>
                    <ChainIcon className={styles.trashColor} onClick={() => this.onSetupLink(x.button, index)} />
                  </div>
                  { this.state.serviceList.length > 1 &&
                    <div className={styles.tool} title="Remove" style={{ marginLeft: 5 }}>
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
        <div >

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
