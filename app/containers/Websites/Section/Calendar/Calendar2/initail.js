import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const year = new Date().getFullYear();

export default {
  name: 'Calendar',
  design: 'Calendar2',
  fluid: false,
  data: {
    title: '<h2 style="margin: 20px 0 40px">Calendar</h2>',
    descrip: `
      <h3 style="text-align: left">This is the title your</h3>
      <p style="text-align: justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis viverra leo. Etiam pellentesque neque sit amet enim faucibus consectetur. Etiam sit amet libero ex. Mauris magna metus, aliquet at sapien ut, tristique luctus justo.</p>
    `,
  },
  setting: {
    date: {
      minDate: `15/02/${year}`,
      maxDate: `15/10/${year}`,
      defaultDate: `07/07/${year}`,
      today: true,
    },
    calendarHeight: 380,
    toolsColor: '#C6C6C6',
    calendarBg: '#F7F7F7',
    descripBg: '#E0E7F1',
    toolCalendar: {
      color: '#A0A0A0',
      activeColor: '#333333',
    },
    override: {
      ...lightBaseTheme,
      palette: {
        primary1Color: '#67CBC9', // Today color font.
        primary2Color: '#618FB4', // Background active font.
        textColor: '#333333', // color font.
        alternateTextColor: '#FFF', // color active font.
      },
    },
  },
};
