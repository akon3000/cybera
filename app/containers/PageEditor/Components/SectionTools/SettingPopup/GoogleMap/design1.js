import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';

import styles from '../styles.css';

import Dialog from '../../../Dialog';
import { PositiveButton, NegativeButton } from '../../../Dialog/Buttons';

import { hideSettingPopup, changeSettingPopup } from '../../../../actions';

class SettingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: false,
      mapWidth: 0,
      mapHeight: 0,
      clientContent: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === 'showSettingPopupGoogleMap1' &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false
    ) {
      this.setState({
        title: nextProps.setting.title,
        mapWidth: nextProps.setting.mapSize.width,
        mapHeight: nextProps.setting.mapSize.height,
        clientContent: nextProps.setting.clientContent,
      });
    }
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup } = this.props;
    return (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === 'showSettingPopupGoogleMap1'}
        contentStyle={{ width: '928px' }}
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                title: this.state.title,
                clientContent: this.state.clientContent,
                mapSize: {
                  width: this.state.mapWidth,
                  height: this.state.mapHeight,
                },
              },
              { ...this.props.data },
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
                label={this.state.title ? 'On' : 'Off'}
                onCheck={() => this.setState({ title: !this.state.title })}
                checked={this.state.title}
                className={styles.checked}
              />
            </Col>
            <Col xs={2}>
              <label htmlFor="label">Content show</label>
              <Checkbox
                label={this.state.clientContent ? 'On' : 'Off'}
                onCheck={() => this.setState({ clientContent: !this.state.clientContent })}
                checked={this.state.clientContent}
                className={styles.checked}
              />
            </Col>
            <Col xs={8}>
              <label htmlFor="label">Map size</label>
              <Row middle="xs">
                <Col xs={6}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.mapWidth}
                    type="number"
                    name="mapWidth"
                    style={{ width: 200 }}
                    onChange={(ev) => this.setState({ mapWidth: ev.target.value })}
                  />
                  <label className={styles.label} htmlFor="map-width">Width <small>( % )</small></label>
                </Col>
                <Col xs={6}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.mapHeight}
                    type="number"
                    name="mapHeight"
                    style={{ width: 200 }}
                    onChange={(ev) => this.setState({ mapHeight: ev.target.value })}
                  />
                  <label className={styles.label} htmlFor="map-height">Height <small>( px )</small></label>
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
