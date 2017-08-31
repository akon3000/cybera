import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import TrashIcon from 'react-icons/lib/ti/trash';
import AddIcon from 'react-icons/lib/fa/plus-square';

import styles from '../styles.css';

import Dialog from '../../../Dialog';
import { PositiveButton, NegativeButton } from '../../../Dialog/Buttons';

import { hideSettingPopup, changeSettingPopup } from '../../../../actions';

import { initailContent as initailContent3 } from '../../../../../Websites/Section/SplitContent/SplitContent3/initail';
import { initailContent as initailContent6 } from '../../../../../Websites/Section/SplitContent/SplitContent6/initail';
import { initailContent as initailContent8 } from '../../../../../Websites/Section/SplitContent/SplitContent8/initail';

class SettingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colum: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === this.props.allowPopup &&
        nextProps.setting !== this.props.setting &&
        nextProps.setting !== false
    ) {
      this.setState({
        colum: nextProps.data.colum,
      });
    }
  }

  addColum() {
    let content = '';
    switch (this.props.popup) {
      case 'showSettingPopupSplitContent3': content = initailContent3; break;
      case 'showSettingPopupSplitContent6': content = initailContent6; break;
      case 'showSettingPopupSplitContent8': content = initailContent8; break;
      default: break;
    }
    const colum = this.state.colum;
    const uniqueID = Math.max(...colum.map((x) => x.id)) + 1;
    colum.push({ id: uniqueID, show: true, content });
    this.setState({ colum });
  }

  removeColum(index) {
    const colum = this.state.colum;
    colum.splice(index, 1);
    this.setState({ colum });
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
              { ...this.props.setting },
              { ...this.props.data, colum: this.state.colum },
            )}
            className={styles.button}
          > Save </PositiveButton>,
          <NegativeButton onClick={() => onHideSettingPopup()}>Cancel</NegativeButton>,
        ]}
      >
        <div className={styles.container}>

          <Row className={styles.rows}>
            {
              this.state.colum.map((x, index) => (
                <Col xs={3} key={`setting-colum-${x.id}`}>
                  <label htmlFor="label">Item {x.id}</label>
                  { this.state.colum.length > 1 &&
                    <div className={styles.tool} style={{ marginLeft: 15 }}>
                      <TrashIcon className={styles.trashColor} onClick={() => this.removeColum(index)} />
                    </div>
                  }
                  <br /><br />
                </Col>
              ))
            }
            <Col xs={3}>
              <div className={styles.toolsColum} style={{ paddingTop: 0 }}>
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
