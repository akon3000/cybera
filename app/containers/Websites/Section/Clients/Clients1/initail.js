export const initailContent = { url: null, link: { url: null, target: '_blank' } };

export default {
  name: 'Clients',
  design: 'Clients1',
  data: {
    title: '<h2 style="text-align: center; padding: 50px 0;">CLIENT SECTION</h2>',
    items: [
      { id: 1, ...initailContent },
      { id: 2, ...initailContent },
      { id: 3, ...initailContent },
      { id: 4, ...initailContent },
      { id: 5, ...initailContent },
      { id: 6, ...initailContent },
      { id: 7, ...initailContent },
      { id: 8, ...initailContent },
    ],
  },
  setting: {
    circle: true,
    imgSize: {
      width: 170,
      height: 170,
    },
    title: {
      show: true,
      backgroundColor: '#e0e7f1',
    },
  },
};
