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
      topImage: false,
      topImageHight: 0,
      title: false,
      iconSize: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === 'showSettingPopupSocialMediaLink1' &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false
    ) {
      this.setState({
        topImage: nextProps.setting.topImage.show,
        topImageHight: nextProps.setting.topImage.height,
        title: nextProps.setting.title,
        iconSize: nextProps.setting.iconSize,
      });
    }
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup } = this.props;
    return (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === 'showSettingPopupSocialMediaLink1'}
        contentStyle={{ width: '928px' }}
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                topImage: {
                  show: this.state.topImage,
                  height: this.state.topImageHight,
                },
                title: this.state.title,
                iconSize: this.state.iconSize,
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
            <Col xs={4} xsOffset={2}>
              <label htmlFor="label">Header image show</label>
              <Checkbox
                label={this.state.topImage ? 'On' : 'Off'}
                onCheck={() => this.setState({ topImage: !this.state.topImage })}
                checked={this.state.topImage}
                className={styles.checked}
              />
            </Col>
            <Col xs={4}>
              <label htmlFor="label">Header image size</label>
              <Col xs={12}>
                <TextField
                  className={styles.fieldStyles}
                  value={this.state.topImageHight}
                  type="number"
                  name="topImageHight"
                  style={{ width: 200 }}
                  onChange={(ev) => this.setState({ topImageHight: ev.target.value })}
                />
                <label className={styles.label} htmlFor="icon-size">Height <small>( px )</small></label>
              </Col>
            </Col>
          </Row>

          <Row className={styles.rows}>
            <Col xs={4} xsOffset={2}>
              <label htmlFor="label">Title show</label>
              <Checkbox
                label={this.state.title ? 'On' : 'Off'}
                onCheck={() => this.setState({ title: !this.state.title })}
                checked={this.state.title}
                className={styles.checked}
              />
            </Col>
            <Col xs={4}>
              <label htmlFor="label">Social icon size</label>
              <Col xs={12}>
                <TextField
                  className={styles.fieldStyles}
                  value={this.state.iconSize}
                  type="number"
                  name="iconSize"
                  style={{ width: 200 }}
                  onChange={(ev) => this.setState({ iconSize: ev.target.value })}
                />
                <label className={styles.label} htmlFor="icon-size">Size <small>( px )</small></label>
              </Col>
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
