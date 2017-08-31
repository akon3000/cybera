import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toggle from 'material-ui/Toggle';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import styles from './styles.css';
import logo from '../../../../assets/image/logo-without-text.png';

import { undo, redo, savePageData, gridSwitch } from '../../actions';

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

class TopBar extends React.Component {
  state = {
    page: [],
  }

  handleChange = (event, index, values) => this.setState({ values })

  menuItems() {
    return names.map((name) => (
      <MenuItem
        key={name}
        // insetChildren={true}
        // checked={values && values.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
    ));
  }

  render() {
    const { history, currentHistory, onUndo, onRedo, onGridSwitch, onSave, websiteID, path, saving, saveSuccess, error, pageData, gridMode } = this.props;
    return (
      <div className={styles.container}>
        <img src={logo} alt="Cybera" className={styles.logo} />
        <div className={styles.pageSelector}>
          <span>Page :</span>
          <SelectField
            dropDownMenuProps={{
              iconButton: <span className={styles.dropDownIcon}><i></i></span>,
            }}
            value={'Oliver Hansen'}
            onChange={this.handleChange}
            style={{ border: '1px solid #FFF', height: '30px', color: '#FFF', marginTop: '15px', fontFamily: 'Montserrat', fontSize: '12px' }}
            underlineStyle={{ display: 'none' }}
            listStyle={{ backgroundColor: '#18B9E3' }}
            iconStyle={{ width: '30px', height: '30px', padding: '0' }}
            selectedMenuItemStyle={{ color: '#FFF', fontWeight: 'bold' }}
            menuItemStyle={{ fontFamily: 'Montserrat', fontSize: '12px', backgroundColor: '#18B9E3', color: '#FFF' }}
            labelStyle={{ color: '#FFF', textIndent: '15px', height: '30px', lineHeight: '36px' }}
          >
            {this.menuItems()}
          </SelectField>
        </div>
        <div className={styles.pageSelector} style={{ marginLeft: '20px' }}>
          <span> History : [
            { history.map((h, key) => {
              if (key === currentHistory) {
                return <b key={Math.random()} style={{ color: 'red' }}>{` ${key}`}</b>;
              }
              return ` ${key}`;
            })}
            { ' ' }
          ]</span>
        </div>
        <div className={styles.rightTools}>

          <div className={styles.pageSelector}>
            { error && <span style={{ color: 'red' }}>{ error }</span> }
            { saveSuccess && <span style={{ color: 'green' }}>{ saveSuccess }</span>}
          </div>

          <button
            className={styles.undo}
            disabled={history.size <= 0 || currentHistory <= 0}
            onClick={() => onUndo()}
          ><i></i></button>

          <button
            className={styles.redo}
            disabled={history.size <= 0 || currentHistory >= history.size - 1}
            onClick={() => onRedo()}
          ><i></i></button>

          <button className={styles.mobile}><i></i></button>

          <div className={styles.gridToggle}>
            <Toggle
              label="Grid Mode"
              labelPosition="right"
              labelStyle={{ color: '#FFF' }}
              style={{ marginTop: 18 }}
              onToggle={(ev, value) => onGridSwitch(value)}
              toggled={gridMode}
            />
          </div>

          <button
            className={styles.publish}
            onClick={() => onSave(websiteID, path, pageData)}
          >{!saving ? 'Publish' : 'Saving...'}</button>

        </div>
      </div>
    );
  }
}

TopBar.propTypes = {
  history: PropTypes.object.isRequired,
  currentHistory: PropTypes.number.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  websiteID: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  saving: PropTypes.bool.isRequired,
  saveSuccess: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  gridMode: PropTypes.bool.isRequired,
  onGridSwitch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onUndo: () => dispatch(undo()),
  onRedo: () => dispatch(redo()),
  onGridSwitch: (value) => dispatch(gridSwitch(value)),
  onSave: (websiteID, path, pageData) => dispatch(savePageData(websiteID, path, pageData)),
  // onMoveSectionUp: (index) => dispatch(moveSectionUp(index)),
  // onMoveSectionDown: (index) => dispatch(moveSectionDown(index)),
  dispatch,
});

const mapStateToProps = (reducer) => {
  const state = reducer.get('pageEditor');
  return {
    history: state.get('history'),
    currentHistory: state.get('currentHistory'),
    websiteID: state.get('websiteID'),
    path: state.get('path'),
    pageData: state.get('pageData'),
    saving: state.get('saving'),
    saveSuccess: state.get('saveSuccess'),
    error: state.get('error'),
    gridMode: state.get('gridMode'),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
