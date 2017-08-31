export default {
  name: 'VerticalTab',
  design: 'VerticalTab1',
  fluid: false,
  data: {
    title: '<h2 style="text-align: center; padding: 35px">Vertical Tab</h2>',
    tabs: [
      {
        id: 1,
        title: 'Tab 1',
        descrip: `
          <h3>This is the title your</h3>
          <p style="text-align: justify; line-height: 30px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        `,
      },
      {
        id: 2,
        title: 'Tab 2',
        descrip: `
          <h3>This is the title your</h3>
          <p style="text-align: justify; line-height: 30px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        `,
      },
      {
        id: 3,
        title: 'Tab 3',
        descrip: `
          <h3>This is the title your</h3>
          <p style="text-align: justify; line-height: 30px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        `,
      },
      {
        id: 4,
        title: 'Tab 4',
        descrip: `
          <h3>This is the title your</h3>
          <p style="text-align: justify; line-height: 30px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        `,
      },
      {
        id: 5,
        title: 'Tab 5',
        descrip: `
          <h3>This is the title your</h3>
          <p style="text-align: justify; line-height: 30px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        `,
      },
    ],
  },
  setting: {
    sizeMinTab: 200,
    sizeMaxHeight: 300,
    title: true,
    tabStyle: {
      Normal: {
        fontFamily: 'Montserrat, sans-serif',
        color: '#000',
        backgroundColor: '#F8F8F8',
      },
      Active: {
        fontFamily: 'Montserrat, sans-serif',
        color: '#000',
        backgroundColor: '#FFF',
      },
      Hover: {
        fontFamily: 'Montserrat, sans-serif',
        color: '#000',
        backgroundColor: '#DDD',
      },
    },
  },
};
