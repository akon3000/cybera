export default {
  name: 'Banner',
  design: 'Banner2',
  fluid: false,
  data: {
    bannerItems: [
      { id: 1, url: null, link: { url: '', target: '_blank' } },
      { id: 2, url: null, link: { url: '', target: '_blank' } },
      { id: 3, url: null, link: { url: '', target: '_blank' } },
    ],
  },
  setting: {
    spaceBetween: true,
    imageSize: {
      height: 210,
    },
  },
};
