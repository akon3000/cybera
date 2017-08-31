import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const override = Object.assign({}, lightBaseTheme, {

  fontFamily: 'Lato, sans-serif',

  paper: {
    borderRadius: '1px',
    zDepthShadows: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },

  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  dialog: {
    // transform: 'none',
  },

  palette: {
    primary1Color: '#67cbc9',
    primary2Color: '#618fb4',
    textColor: '#333333',
  },

  checkbox: {
    boxColor: '#898989',
    checkedColor: '#67cbc9',
  },

  flatButton: {
    textColor: 'red',
  },

  radioButton: {
    borderColor: '#898989',
    checkedColor: '#67cbc9',
  },

  toggle: {
    thumbOnColor: '#9BD0F6',
    trackOnColor: '#BADEFC',
    thumbOffColor: '#E2E2E2',
    trackOffColor: '#F3F3F3',
    thumbDisabledColor: '#E2E2E2',
    trackDisabledColor: '#F3F3F3',
  },

  zIndex: {
    menu: 1000,
    appBar: 1100,
    drawerOverlay: 1200,
    drawer: 1300,
    dialogOverlay: 1400,
    dialog: 1500,
    layer: 2000,
    popover: 2100,
    snackbar: 2900,
    tooltip: 3000,
  },

  datePicker: {
    headerColor: '#618FB4',
  },

});

export default override;
