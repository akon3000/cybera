import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
      height: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === 'showSettingPopupAboutUs1' &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false &&
        nextProps.data !== this.props.data &&
        nextProps.data !== false
    ) {
      this.setState({
        height: nextProps.data.image.height,
      });
    }
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup } = this.props;
    return (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === 'showSettingPopupAboutUs1'}
        contentStyle={{ width: '928px' }}
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              { ...this.props.setting },
              { ...this.props.data,
                image: {
                  ...this.props.data.image,
                  height: this.state.height,
                },
              },
            )}
            className={styles.button}
          > Save </PositiveButton>,
          <NegativeButton onClick={() => onHideSettingPopup()}>Cancel</NegativeButton>,
        ]}
      >
        <div className={styles.container}>

          <Row className={styles.rows}>
            <Col xs={12}>
              <label htmlFor="label">Image height</label>
              <Col xs={12}>
                <TextField
                  className={styles.fieldStyles}
                  value={this.state.height}
                  type="number"
                  name="height"
                  style={{ width: 200 }}
                  onChange={(ev) => this.setState({ height: ev.target.value })}
                />
                <label className={styles.label} htmlFor="icon-size">Height <small>( px )</small></label>
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
