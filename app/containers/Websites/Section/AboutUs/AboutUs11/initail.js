export default {
  name: 'AboutUs',
  design: 'AboutUs11',
  fluid: false,
  data: {
    titleA: '<h2 style="text-align: center; color: #A0A0A0; padding: 50px 0;">ABOUT US</h2>',
    titleB: '<h3 style="text-align: center; padding: 25px 0;">This is the title your</h3>',
    content: '<p style="text-align: justify; padding: 25px;"">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>',
    image: { id: 1, url: null, size: 200, link: { url: '', target: '_blank' } },
  },
  setting: {
    titleA: true,
    titleB: true,
    content: true,
    image: true,
    style: {
      titleA: {
        backgroundColor: '#F8F8F8',
      },
    },
  },
};
