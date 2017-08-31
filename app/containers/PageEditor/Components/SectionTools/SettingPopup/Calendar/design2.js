import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import { Row, Col } from 'react-flexbox-grid';

import styles from '../styles.css';

import Dialog from '../../../Dialog';
import ColorPicker from '../../../ColorPicker';
import { PositiveButton, NegativeButton } from '../../../Dialog/Buttons';

import { hideSettingPopup, changeSettingPopup } from '../../../../actions';

class SettingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarHeight: 0,
      toolsColor: '',
      calendarBg: '',
      descripBg: '',
      primary1Color: '',
      primary2Color: '',
      textColor: '',
      alternateTextColor: '',
      color: '',
      activeColor: '',
      defaultDate: '',
      minDate: '',
      maxDate: '',
      today: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === 'showSettingPopupCalendar2' &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false
    ) {
      this.setState({
        calendarHeight: nextProps.setting.calendarHeight,
        toolsColor: nextProps.setting.toolsColor,
        calendarBg: nextProps.setting.calendarBg,
        descripBg: nextProps.setting.descripBg,
        primary1Color: nextProps.setting.override.palette.primary1Color,
        primary2Color: nextProps.setting.override.palette.primary2Color,
        textColor: nextProps.setting.override.palette.textColor,
        alternateTextColor: nextProps.setting.override.palette.alternateTextColor,
        color: nextProps.setting.toolCalendar.color,
        activeColor: nextProps.setting.toolCalendar.activeColor,
        defaultDate: nextProps.setting.date.defaultDate,
        minDate: nextProps.setting.date.minDate,
        maxDate: nextProps.setting.date.maxDate,
        today: nextProps.setting.date.today,
      });
    }
  }

  setDate(date, key) {
    const dateUpdate = this.formatDate(date);
    switch (key) {
      case 'defaultDate': this.setState({ defaultDate: dateUpdate }); break;
      case 'minDate': this.setState({ minDate: dateUpdate }); break;
      case 'maxDate': this.setState({ maxDate: dateUpdate }); break;
      default: break;
    }
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup } = this.props;
    const dialogStyle = {
      boxShadow: '2px 2px 5px #DDD',
      backgroundColor: '#FFF',
    };
    const hintStyle = {
      fontSize: 12,
      left: '50%',
      transform: 'translateX(-50%)',
    };

    const minDateSplit = this.state.minDate.split('/');
    const maxDateSplit = this.state.maxDate.split('/');
    const defaultDateSplit = this.state.defaultDate.split('/');
    const minDate = new Date(minDateSplit[2], minDateSplit[1] - 1, minDateSplit[0]);
    const maxDate = new Date(maxDateSplit[2], maxDateSplit[1] - 1, maxDateSplit[0]);
    const defaultDate = new Date(defaultDateSplit[2], defaultDateSplit[1] - 1, defaultDateSplit[0]);
    const maxMinDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() - 1);
    const minMaxDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() + 1);

    return (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === 'showSettingPopupCalendar2'}
        contentStyle={{ width: '928px' }}
        bodyCustom="showSettingPopupCalendar2"
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                calendarHeight: this.state.calendarHeight,
                toolsColor: this.state.toolsColor,
                calendarBg: this.state.calendarBg,
                descripBg: this.state.descripBg,
                toolCalendar: {
                  ...this.props.setting.toolCalendar,
                  color: this.state.color,
                  activeColor: this.state.activeColor,
                },
                override: {
                  ...this.props.setting.override,
                  palette: {
                    primary1Color: this.state.primary1Color,
                    primary2Color: this.state.primary2Color,
                    textColor: this.state.textColor,
                    alternateTextColor: this.state.alternateTextColor,
                  },
                },
                date: {
                  ...this.props.setting.date,
                  defaultDate: this.state.today ? this.props.setting.date.defaultDate : this.state.defaultDate,
                  minDate: this.state.minDate,
                  maxDate: this.state.maxDate,
                  today: this.state.today,
                },
              },
              { ...this.props.data },
            )}
          > Save </PositiveButton>,
          <NegativeButton onClick={() => onHideSettingPopup()}>Cancel</NegativeButton>,
        ]}
      >
        <div className={styles.container} >

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Min Date</label>
              <Row middle="xs">
                <Col xs={12}>
                  <DatePicker
                    className={styles.fieldStyles}
                    autoOk={Boolean(true)}
                    hintText="DD/MM/YYYY"
                    container="inline"
                    mode="landscape"
                    dialogContainerStyle={dialogStyle}
                    hintStyle={hintStyle}
                    maxDate={maxMinDate}
                    formatDate={(date) => this.formatDate(date)}
                    value={minDate}
                    onChange={(ev, date) => this.setDate(date, 'minDate')}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Max Date</label>
              <Row middle="xs">
                <Col xs={12}>
                  <DatePicker
                    className={styles.fieldStyles}
                    autoOk={Boolean(true)}
                    hintText="DD/MM/YYYY"
                    container="inline"
                    mode="landscape"
                    dialogContainerStyle={dialogStyle}
                    hintStyle={hintStyle}
                    minDate={minMaxDate}
                    formatDate={(date) => this.formatDate(date)}
                    value={maxDate}
                    onChange={(ev, date) => this.setDate(date, 'maxDate')}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="html">Default date</label>
              <Row middle="xs">
                <Col xs={8}>
                  <DatePicker
                    className={styles.fieldStyles}
                    hintText="DD/MM/YYYY"
                    container="inline"
                    mode="landscape"
                    autoOk={Boolean(true)}
                    dialogContainerStyle={dialogStyle}
                    hintStyle={hintStyle}
                    minDate={minDate}
                    maxDate={maxDate}
                    formatDate={(date) => this.formatDate(date)}
                    value={this.state.today ? null : defaultDate}
                    onChange={(ev, date) => this.setDate(date, 'defaultDate')}
                    disabled={this.state.today}
                  />
                </Col>
                <Col xs={4} style={{ padding: 0 }}>
                  <Checkbox
                    label="Today"
                    onCheck={() => this.setState({ today: !this.state.today })}
                    checked={this.state.today}
                    className={styles.checked}
                    style={{ marginLeft: -8 }}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Calendar height</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.calendarHeight}
                    type="text"
                    name="calendarHeight"
                    onChange={(ev) => this.setState({ calendarHeight: ev.target.value })}
                  />
                  <label className={styles.label} htmlFor="content-calendar-height">Height <small>( PX )</small></label>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Day select font color</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.alternateTextColor}
                    type="text"
                    name="alternateTextColor"
                    onChange={(ev) => this.setState({ alternateTextColor: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.alternateTextColor}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ alternateTextColor: color })}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Navigation color</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.toolsColor}
                    type="text"
                    name="toolsColor"
                    onChange={(ev) => this.setState({ toolsColor: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.toolsColor}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ toolsColor: color })}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Calendar background</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.calendarBg}
                    type="text"
                    name="calendarBg"
                    onChange={(ev) => this.setState({ calendarBg: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.calendarBg}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ calendarBg: color })}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Description background</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.descripBg}
                    type="text"
                    name="descripBg"
                    onChange={(ev) => this.setState({ descripBg: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.descripBg}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ descripBg: color })}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Tools font color</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.color}
                    type="text"
                    name="color"
                    onChange={(ev) => this.setState({ color: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.color}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ color })}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Tools select font color</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.activeColor}
                    type="text"
                    name="activeColor"
                    onChange={(ev) => this.setState({ activeColor: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.activeColor}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ activeColor: color })}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Today font color</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.primary1Color}
                    type="text"
                    name="primary1Color"
                    onChange={(ev) => this.setState({ primary1Color: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.primary1Color}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ primary1Color: color })}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Day select background</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.primary2Color}
                    type="text"
                    name="primary2Color"
                    onChange={(ev) => this.setState({ primary2Color: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.primary2Color}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ primary2Color: color })}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Day font color</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.textColor}
                    type="text"
                    name="textColor"
                    onChange={(ev) => this.setState({ textColor: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.textColor}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ textColor: color })}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Day select font color</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.alternateTextColor}
                    type="text"
                    name="alternateTextColor"
                    onChange={(ev) => this.setState({ alternateTextColor: ev.target.value })}
                  />
                  <ColorPicker
                    color={this.state.alternateTextColor}
                    contentElement="showSettingPopupCalendar2"
                    onUpdate={(color) => this.setState({ alternateTextColor: color })}
                  />
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
