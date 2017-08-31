import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PlushIcon from 'react-icons/lib/go/plus';
import UpIcon from 'react-icons/lib/go/arrow-up';
import DownIcon from 'react-icons/lib/go/arrow-down';
import TrashIcon from 'react-icons/lib/fa/trash-o';
// import ChangeIcon from 'react-icons/lib/md/compare';
import AddIcon from 'react-icons/lib/md/add';
import SettingIcon from 'react-icons/lib/fa/cogs';

import styles from './styles.css';

import Button from '../Button';

import ConfirmDialog from '../ConfirmDialog';

import BackgroundEditor from './Components/BackgroundEditor';
import ButtonStyling from './Components/ButtonStyling';
import ButtonFluid from './Components/ButtonFluid';

import {
  moveSectionUp,
  moveSectionDown,
  showSectionList,
  showSectionDesigns,
  deleteSection,
  showFileManager,
  showSettingPopup,
  buttonStylingChange,
  fluidChange,
} from '../../actions';

class SectionTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirm: false,
      isValidSetting: ['ImageGallery', 'ImageSlider'],
    };
  }

  render() {
    const {
      section,
      sectionID,
      index,
      fluid,
      onShowAddSection,
      onDeleteSection,
      onShowFileManager,
      // onShowSectionDesigns,
      onShowSettingPopup,
      onButtonStylingChange,
      onSetFluid,
    } = this.props;
    return (
      <div className={`${styles.container} ${fluid ? styles.fluid : ''}`}>
        {
          // className={`sectionContainer ${styles.section} ${this.props.isActive && styles.active}`}
          // id={`sectionContainer_${this.props.sectionID}`}
          // key={this.props.sectionID}
          // onClick={() => {
          //   this.props.onClickSection(this.props.sectionID);
          // }}
        }
        <button
          className={`${styles.addSection} ${styles.top} ${fluid && styles.fluid}`}
          onClick={() => onShowAddSection(index)}
        ><PlushIcon /></button>
        <button
          className={`${styles.addSection} ${styles.bottom} ${fluid && styles.fluid}`}
          onClick={() => onShowAddSection(index + 1)}
        ><PlushIcon /></button>
        <button
          className={`${styles.arrowSection} ${styles.up}`}
          onClick={() => this.props.onMoveSectionUp(this.props.index)}
        ><UpIcon /></button>
        <button
          className={`${styles.arrowSection} ${styles.down}`}
          onClick={() => this.props.onMoveSectionDown(this.props.index)}
        ><DownIcon /></button>
        <div className={styles.customSectoinTools}>
          { section.get('name') === 'ImageSlider' &&
            <Button
              icon={<AddIcon />}
              text="Add image"
              onClick={() => onShowFileManager(0, 'items', sectionID, 'Body')}
            />
          }
          { section.get('name') === 'ImageGallery' &&
            <Button
              icon={<AddIcon />}
              text="Add image"
              onClick={() => onShowFileManager(0, 'ImageGallery', sectionID, 'Body')}
            />
          }
          { // section.get('name') === 'AboutUs' &&
            // <Button
            //   icon={<ChangeIcon />}
            //   text="Change design"
            //   onClick={() => onShowSectionDesigns(sectionID)}
            // />
          }
          { section.get('name') === 'HorizontalTab' &&
            <ButtonStyling
              label="Manage Tab"
              settingStyle={section.get('setting').get('tapHeaderStyle').toJS()}
              anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
              targetOrigin={{ horizontal: 'right', vertical: 'center' }}
              onClose={(settingStyle) => onButtonStylingChange(section.get('id'), settingStyle)}
            />
          }
          { section.get('name') === 'VerticalTab' &&
            <ButtonStyling
              label="Manage Tab"
              settingStyle={section.get('setting').get('tabStyle').toJS()}
              anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
              targetOrigin={{ horizontal: 'right', vertical: 'center' }}
              onClose={(settingStyle) => onButtonStylingChange(section.get('id'), settingStyle)}
            />
          }
          <BackgroundEditor />
          <ButtonFluid onFluid={(newFluid) => onSetFluid(newFluid)} fluid={fluid} />
          { this.state.isValidSetting.indexOf(section.get('name')) < 0 &&
            <Button icon={<SettingIcon />} onClick={() => onShowSettingPopup()} />
          }
          <Button icon={<TrashIcon />} onClick={() => this.setState({ showConfirm: true })} />
        </div>
        { this.state.showConfirm &&
          <ConfirmDialog
            title="Confirmation"
            onConfirm={() => onDeleteSection(sectionID)}
            onCancel={() => this.setState({ showConfirm: false })}
          >Are you sure you want to delete this item?</ConfirmDialog>
        }
      </div>
    );
  }
}

SectionTools.propTypes = {
  sectionID: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  section: PropTypes.object.isRequired,
  fluid: PropTypes.bool,

  onMoveSectionUp: PropTypes.func.isRequired,
  onMoveSectionDown: PropTypes.func.isRequired,
  onShowAddSection: PropTypes.func.isRequired,
  onDeleteSection: PropTypes.func.isRequired,

  // onShowSectionDesigns: PropTypes.func,
  onShowFileManager: PropTypes.func.isRequired,
  onShowSettingPopup: PropTypes.func.isRequired,

  onButtonStylingChange: PropTypes.func.isRequired,

  onSetFluid: PropTypes.func.isRequired,
  // order: PropTypes.number.isRequired,
};

SectionTools.defaultProps = {
  style: {},
  fluid: false,
  onShowSectionDesigns: () => {},
};

const mapDispatchToProps = (dispatch) => ({
  onMoveSectionUp: (index) => dispatch(moveSectionUp(index)),
  onMoveSectionDown: (index) => dispatch(moveSectionDown(index)),
  onShowAddSection: (index) => dispatch(showSectionList(index)),
  onDeleteSection: (sectionID) => dispatch(deleteSection(sectionID)),
  onShowSectionDesigns: (sectionID) => dispatch(showSectionDesigns(sectionID)),
  onShowSettingPopup: () => dispatch(showSettingPopup()),
  onShowFileManager: (id, imageType, sectionID, sectionGroup) => dispatch(showFileManager(id, imageType, sectionID, sectionGroup)),
  onButtonStylingChange: (sectionID, newStyling) => dispatch(buttonStylingChange(sectionID, newStyling)),
  onSetFluid: (fluid) => dispatch(fluidChange(fluid)),
  dispatch,
});

export default connect(null, mapDispatchToProps)(SectionTools);
