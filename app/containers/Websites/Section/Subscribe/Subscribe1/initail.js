export default {
  name: 'Subscribe',
  design: 'Subscribe1',
  fluid: false,
  data: {
    title: '<h2 style="padding: 50px 0; text-align: center;">Subscribe</h2>',
    submit: 'SUBMIT',
    subscribe: {
      name: '',
      email: 'Email Address',
    },
  },
  setting: {
    title: {
      show: true,
      backgroundColor: '#FFF',
    },
    subscribe: {
      name: {},
      email: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderStyle: 'solid',
      },
    },
    submit: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#D1DFF1',
      backgroundColor: '#E0E7F1',
    },
  },
};
