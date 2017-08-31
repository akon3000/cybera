import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import AddTabIcon from 'react-icons/lib/md/playlist-add';
import TrashIcon from 'react-icons/lib/ti/trash';
import DownIcon from 'react-icons/lib/fa/angle-down';
import UpIcon from 'react-icons/lib/fa/angle-up';
import { Row, Col } from 'react-flexbox-grid';

import styles from '../styles.css';

import Dialog from '../../../Dialog';
import { PositiveButton, NegativeButton } from '../../../Dialog/Buttons';

import { hideSettingPopup, changeSettingPopup } from '../../../../actions';

class SettingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizeMinTab: 0,
      sizeMaxHeight: 0,
      title: false,
      tabs: [],
      inputAdd: (
        <TextField
          className={styles.fieldStyles}
          type="text"
          name="add-tabs-array"
          onBlur={(ev) => this.addTabs(ev.target.value)}
        />
      ),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === 'showSettingPopupVerticalTab1' &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false &&
        nextProps.data !== this.props.data &&
        nextProps.data !== false
    ) {
      this.setState({
        title: nextProps.setting.title,
        tabs: nextProps.data.tabs,
        sizeMinTab: nextProps.setting.sizeMinTab,
        sizeMaxHeight: nextProps.setting.sizeMaxHeight,
      });
    }
  }

  onChangeTabTitle(value, index) {
    const tabs = this.state.tabs;
    tabs[index].title = value;
    this.setState({ tabs });
  }

  addTabs(value) {
    this.setState({ inputAdd: null }, () => {
      const tabs = this.state.tabs;
      const uniqueID = Math.max(...tabs.map((x) => x.id)) + 1;
      tabs.push({ id: uniqueID, title: value, descrip: '' });
      this.setState({
        tabs,
        inputAdd: (
          <TextField
            className={styles.fieldStyles}
            type="text"
            name="add-tabs-array"
            onBlur={(ev) => this.addTabs(ev.target.value)}
          />
        ),
      });
    });
  }

  removeTabs(index) {
    const tabs = this.state.tabs;
    tabs.splice(index, 1);
    this.setState({ tabs });
  }

  moveUpTabs(index) {
    if (index === 0) return;
    const tabs = this.state.tabs;
    const currentItem = tabs[index];
    const previousItem = tabs[index - 1];
    tabs[index] = previousItem;
    tabs[index - 1] = currentItem;
    this.setState({ tabs });
  }

  moveDownTabs(index) {
    if ((index + 1) === this.state.tabs.length) return;
    const tabs = this.state.tabs;
    const currentItem = tabs[index];
    const nextItem = tabs[index + 1];
    tabs[index] = nextItem;
    tabs[index + 1] = currentItem;
    this.setState({ tabs });
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup } = this.props;
    return (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === 'showSettingPopupVerticalTab1'}
        contentStyle={{ width: '928px' }}
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                title: this.state.title,
                sizeMinTab: this.state.sizeMinTab,
                sizeMaxHeight: this.state.sizeMaxHeight,
              },
              { ...this.props.data, ...this.state.tabs }
            )}
            className={styles.button}
          > Save </PositiveButton>,
          <NegativeButton onClick={() => onHideSettingPopup()}>Cancel</NegativeButton>,
        ]}
      >
        <div className={styles.container}>

          <Row className={styles.rows}>
            <Col xs={3} xsOffset={2}>
              <label htmlFor="label">Title show</label>
              <Checkbox
                label={this.state.title ? 'SHOW' : 'HIDE'}
                onCheck={() => this.setState({ title: !this.state.title })}
                checked={this.state.title}
                className={styles.checked}
              />
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Tab size</label>
              <Col xs={12}>
                <TextField
                  className={styles.fieldStyles}
                  value={this.state.sizeMinTab}
                  type="text"
                  name="setting-tabs-size"
                  onChange={(ev) => this.setState({ sizeMinTab: ev.target.value })}
                />
                <label className={styles.label} htmlFor="tab-size">Width <small>( px )</small></label>
              </Col>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={6} xsOffset={5}>
              <label htmlFor="label">Section max height</label>
              <Col xs={12}>
                <TextField
                  className={styles.fieldStyles}
                  value={this.state.sizeMaxHeight}
                  type="text"
                  name="setting-max-height"
                  onChange={(ev) => this.setState({ sizeMaxHeight: ev.target.value })}
                />
                <label className={styles.label} htmlFor="vertical-max-height">Height <small>( px )</small></label>
              </Col>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={8} xsOffset={2}>
              <label htmlFor="label">Tab</label>
              <Row middle="xs">
                {
                  this.state.tabs.map((x, idx) => (
                    <Col xs={10} key={`setting-tabs-data-${x.id}`}>
                      <span className={styles.label}>Tab {idx + 1}</span>
                      <TextField
                        className={styles.fieldStyles}
                        value={x.title}
                        type="text"
                        name={`setting-tabs-data-${x.id}`}
                        onChange={(ev) => this.onChangeTabTitle(ev.target.value, idx)}
                      />
                      <div className={styles.tool}>
                        <UpIcon className={styles.moveColor} onClick={() => this.moveUpTabs(idx)} />
                        <DownIcon className={styles.moveColor} onClick={() => this.moveDownTabs(idx)} />
                        { this.state.tabs.length > 1 &&
                          <TrashIcon className={styles.trashColor} onClick={() => this.removeTabs(idx)} />
                        }
                      </div>
                    </Col>
                  ))
                }
                <Col xs={12}>
                  <label className={styles.label} htmlFor="icon-size" style={{ fontSize: '25px' }}>
                    <AddTabIcon /> &nbsp;
                  </label>
                  { this.state.inputAdd }
                </Col>
              </Row>
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
