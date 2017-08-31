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
      spaceBetween: false,
      bannerHeight: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === this.props.allowPopup &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false
    ) {
      this.setState({
        spaceBetween: nextProps.setting.spaceBetween,
        bannerHeight: nextProps.setting.imageSize.height,
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
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                spaceBetween: this.state.spaceBetween,
                imageSize: { ...this.props.setting.imageSize, height: this.state.bannerHeight },
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
            <Col xs={3}>
              <label htmlFor="label">Between space</label>
              <Checkbox
                label={this.state.spaceBetween ? 'On' : 'Off'}
                onCheck={() => this.setState({ spaceBetween: !this.state.spaceBetween })}
                checked={this.state.spaceBetween}
                className={styles.checked}
              />
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Image size</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.bannerHeight}
                    type="number"
                    name="bannerHeight"
                    onChange={(ev) => this.setState({ bannerHeight: ev.target.value })}
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
