import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { Row, Col } from 'react-flexbox-grid';

import styles from '../styles.css';

import Dialog from '../../../Dialog';
import { PositiveButton, NegativeButton } from '../../../Dialog/Buttons';

import { hideSettingPopup, changeSettingPopup } from '../../../../actions';

class SettingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPicker: '',
      size: 0,
      titleA: false,
      titleB: false,
      image: false,
      content: false,
      titleABackground: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === 'showSettingPopupAboutUs11' &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false &&
        nextProps.data !== this.props.data &&
        nextProps.data !== false
    ) {
      this.setState({
        size: nextProps.data.image.size,
        titleA: nextProps.setting.titleA,
        titleB: nextProps.setting.titleB,
        image: nextProps.setting.image,
        content: nextProps.setting.content,
        titleABackground: nextProps.setting.style.titleA.backgroundColor,
      });
    }
  }

  render() {
    const { popup, onHideSettingPopup, onChangeSettingPopup } = this.props;
    const stylePicker = {
      position: 'absolute',
      top: '0',
      left: '100%',
      zIndex: '10',
      transform: 'translate(40px, -50%)',
    };

    return (
      <Dialog
        title="Setting"
        onClose={() => onHideSettingPopup()}
        open={popup === 'showSettingPopupAboutUs11'}
        contentStyle={{ width: '928px' }}
        bodyCustom={styles.bodyCustom}
        bodyStyle={{ overflowY: 'none' }}
        actions={[
          <PositiveButton
            onClick={() => onChangeSettingPopup(
              {
                ...this.props.setting,
                titleA: this.state.titleA,
                titleB: this.state.titleB,
                image: this.state.image,
                content: this.state.content,
                style: {
                  ...this.props.setting.style,
                  titleA: {
                    ...this.props.setting.style.titleA,
                    backgroundColor: this.state.titleABackground,
                  },
                },
              },
              { ...this.props.data,
                image: {
                  ...this.props.data.image,
                  size: this.state.size,
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
              <label htmlFor="label">First title show</label>
              <Checkbox
                label={this.state.titleA ? 'On' : 'Off'}
                onCheck={() => this.setState({ titleA: !this.state.titleA })}
                checked={this.state.titleA}
                className={styles.checked}
              />
            </Col>
            <Col xs={3}>
              <label htmlFor="label">Second title show</label>
              <Checkbox
                label={this.state.titleB ? 'On' : 'Off'}
                onCheck={() => this.setState({ titleB: !this.state.titleB })}
                checked={this.state.titleB}
                className={styles.checked}
              />
            </Col>
            <Col xs={3}>
              <label htmlFor="label">Image show</label>
              <Checkbox
                label={this.state.image ? 'On' : 'Off'}
                onCheck={() => this.setState({ image: !this.state.image })}
                checked={this.state.image}
                className={styles.checked}
              />
            </Col>
            <Col xs={3}>
              <label htmlFor="label">Content show</label>
              <Checkbox
                label={this.state.content ? 'On' : 'Off'}
                onCheck={() => this.setState({ content: !this.state.content })}
                checked={this.state.content}
                className={styles.checked}
              />
            </Col>
          </Row>
          <br />
          <Row className={styles.rows}>
            <Col xs={6}>
              <label htmlFor="label">Image Size</label>
              <Col xs={12}>
                <TextField
                  className={styles.fieldStyles}
                  value={this.state.size}
                  type="number"
                  name="size"
                  onChange={(ev) => this.setState({ size: ev.target.value })}
                />
                <label className={styles.label} htmlFor="icon-size">Size <small>( px )</small></label>
              </Col>
            </Col>
            <Col xs={6}>
              <label htmlFor="label">First title background</label>
              <Col xs={12}>
                <TextField
                  className={styles.fieldStyles}
                  value={this.state.titleABackground}
                  type="text"
                  name="titleABackground"
                  onChange={(ev) => this.setState({ titleABackground: ev.target.value })}
                />
                <div className={styles.boxContent}>
                  <button
                    className={styles.box}
                    style={{ backgroundColor: this.state.titleABackground }}
                    onClick={() => {
                      this.setState({
                        showPicker: this.state.showPicker === 'titleABackground' ? '' : 'titleABackground',
                      });
                    }}
                  ></button>
                  { this.state.showPicker === 'titleABackground' &&
                    <div style={stylePicker}>
                      <ChromePicker
                        color={this.state.titleABackground}
                        onChangeComplete={(color) => this.setState({ titleABackground: color.hex })}
                      />
                    </div>
                  }
                </div>
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
