import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';
import TrashIcon from 'react-icons/lib/ti/trash';
import AddIcon from 'react-icons/lib/fa/plus-square';

import styles from '../styles.css';

import Dialog from '../../../Dialog';
import ColorPicker from '../../../ColorPicker';
import { PositiveButton, NegativeButton } from '../../../Dialog/Buttons';

import { hideSettingPopup, changeSettingPopup } from '../../../../actions';

import { initailContent as initailContent1 } from '../../../../../Websites/Section/Testimonials/Testimonials1/initail';

class SettingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleShow: false,
      titleBackground: '',
      widthImage: 0,
      hightImage: 0,
      testimonialsList: [],
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
        widthImage: nextProps.setting.imgSize.width,
        hightImage: nextProps.setting.imgSize.height,
        testimonialsList: nextProps.data.testimonialsList,
      });
    }
  }

  addColum() {
    const testimonialsList = this.state.testimonialsList;
    const uniqueID = Math.max(...testimonialsList.map((x) => x.id)) + 1;
    let init = { id: uniqueID };
    switch (this.props.popup) {
      case 'showSettingPopupTestimonials1': init = { ...init, ...initailContent1 }; break;
      default: break;
    }
    testimonialsList.push(init);
    this.setState({ testimonialsList });
  }

  removeColum(index) {
    const testimonialsList = this.state.testimonialsList;
    testimonialsList.splice(index, 1);
    this.setState({ testimonialsList });
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
                imgSize: {
                  ...this.props.setting.imgSize,
                  width: this.state.widthImage,
                  height: this.state.hightImage,
                },
              },
              { ...this.props.data, testimonialsList: this.state.testimonialsList },
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
                label={this.state.titleShow ? 'On' : 'Off'}
                onCheck={() => this.setState({ titleShow: !this.state.titleShow })}
                checked={this.state.titleShow}
                className={styles.checked}
              />
            </Col>
            <Col xs={3}>
              <label htmlFor="label">Title background</label>
              <Row middle="xs">
                <Col xs={12}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.titleBackground}
                    type="text"
                    name="titleBackground"
                    style={{ width: 150 }}
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
            <Col xs={7}>
              <label htmlFor="label">Image size</label>
              <Row middle="xs">
                <Col xs={6}>
                  <TextField
                    className={styles.fieldStyles}
                    value={this.state.widthImage}
                    type="number"
                    name="widthImage"
                    style={{ width: 150 }}
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
                    style={{ width: 150 }}
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
              this.state.testimonialsList.map((x, index) => (
                <Col xs={3} key={`setting-testimonialsList-${x.id}`}>
                  <label htmlFor="label">Item {x.id}</label>
                  { this.state.testimonialsList.length > 1 &&
                    <div className={styles.tool} style={{ marginLeft: 15 }}>
                      <TrashIcon className={styles.trashColor} onClick={() => this.removeColum(index)} />
                    </div>
                  }
                </Col>
              ))
            }
            <Col xs={3}>
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
