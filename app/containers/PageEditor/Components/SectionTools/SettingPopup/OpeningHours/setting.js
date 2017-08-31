import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
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
      image: {},
      openingHours: {},
      showPicker: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === this.props.allowPopup &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false &&
        nextProps.data !== this.props.data &&
        nextProps.data !== false
    ) {
      this.setState({
        image: nextProps.setting.style.image,
        openingHours: nextProps.setting.style.openingHours,
      });
    }
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup, allowPopup } = this.props;

    return (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === allowPopup}
        contentStyle={{ width: '928px' }}
        bodyCustom={`${allowPopup}`}
        actions={[
          <PositiveButton
            onClick={() => {
              this.setState({ showPicker: '' }, onChangeSettingPopup(
                { ...this.props.setting,
                  style: {
                    ...this.props.setting.style,
                    image: { ...this.props.setting.style.image, ...this.state.image },
                    openingHours: { ...this.props.setting.style.openingHours, ...this.state.openingHours },
                  },
                },
                { ...this.props.data },
              ));
            }}
            className={styles.button}
          > Save </PositiveButton>,
          <NegativeButton onClick={() => onHideSettingPopup()}>Cancel</NegativeButton>,
        ]}
      >
        <div className={styles.container}>

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Opening hours background</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.openingHours.backgroundColor}
                    type="text"
                    name="openingHoursBackground"
                    onChange={(ev) => this.setState({ openingHours: { ...this.state.openingHours, backgroundColor: ev.target.value } })}
                  />
                  <ColorPicker
                    color={this.state.openingHours.backgroundColor}
                    contentElement={`${allowPopup}`}
                    onUpdate={(color) => this.setState({ openingHours: { ...this.state.openingHours, backgroundColor: color } })}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Opening hours border</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.openingHours.borderColor}
                    type="text"
                    name="openingHoursBackground"
                    onChange={(ev) => this.setState({ openingHours: { ...this.state.openingHours, borderColor: ev.target.value } })}
                  />
                  <ColorPicker
                    color={this.state.openingHours.borderColor}
                    contentElement={`${allowPopup}`}
                    onUpdate={(color) => this.setState({ openingHours: { ...this.state.openingHours, borderColor: color } })}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={12}>
              <label htmlFor="label">Opening hours size</label>
              <Row middle="xs">
                <Col xs={6}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.openingHours.maxWidth}
                    type="number"
                    name="openingHoursWidth"
                    onChange={(ev) => this.setState({ openingHours: { ...this.state.openingHours, maxWidth: ev.target.value } })}
                  />
                  <label className={styles.label} htmlFor="icon-size">Width <small>( px )</small></label>
                </Col>
                <Col xs={6}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.openingHours.maxHeight}
                    type="number"
                    name="openingHoursHeight"
                    onChange={(ev) => this.setState({ openingHours: { ...this.state.openingHours, maxHeight: ev.target.value } })}
                  />
                  <label className={styles.label} htmlFor="icon-size">Height <small>( px )</small></label>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Image size</label>
              <Row>
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.image.height}
                    type="number"
                    name="imageHeight"
                    onChange={(ev) => this.setState({ image: { ...this.state.image, height: ev.target.value } })}
                  />
                  <label className={styles.label} htmlFor="icon-size">Height <small>( px )</small></label>
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
