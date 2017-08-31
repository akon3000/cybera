import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
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
      titleShow: false,
      titleBackground: '',
      emailPlaceHolder: '',
      submitButton: '',
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
        emailPlaceHolder: nextProps.data.subscribe.email,
        submitButton: nextProps.data.submit,
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
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                title: {
                  ...this.props.setting.title,
                  show: this.state.titleShow,
                  backgroundColor: this.state.titleBackground,
                },
              },
              {
                ...this.props.data,
                submit: this.state.submitButton,
                subscribe: {
                  ...this.props.data.subscribe,
                  email: this.state.emailPlaceHolder,
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
            <Col xs={3}>
              <label htmlFor="label">Title show</label>
              <Checkbox
                label={this.state.titleShow ? 'On' : 'Off'}
                onCheck={() => this.setState({ titleShow: !this.state.titleShow })}
                checked={this.state.titleShow}
                className={styles.checked}
              />
            </Col>
            <Col xs={5}>
              <label htmlFor="label">Title background</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.titleBackground}
                    type="text"
                    name="titleBackground"
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
          </Row>

          <div className={styles.hr} />

          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Email</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.emailPlaceHolder}
                    type="text"
                    name="emailPlaceHolder"
                    onChange={(ev) => this.setState({ emailPlaceHolder: ev.target.value })}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">Submit</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.submitButton}
                    type="text"
                    name="submitButton"
                    onChange={(ev) => this.setState({ submitButton: ev.target.value })}
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
