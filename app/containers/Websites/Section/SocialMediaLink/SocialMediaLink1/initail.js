export default {
  name: 'SocialMediaLink',
  design: 'SocialMediaLink1',
  data: {
    topImage: '',
    topImageLink: { url: '', target: '_blank' },
    title: '<h2 style="text-align: center;">SOCIAL SECTION</h2>',
    socialList: [
      { id: 1, url: 'https://www.facebook.com' },
      { id: 2, url: 'https://www.twitter.com' },
      { id: 3, url: 'https://www.plus.google.com' },
      { id: 4, url: 'https://www.instagram.com' },
    ],
  },
  setting: {
    topImage: {
      show: true,
      height: 150,
    },
    title: true,
    iconSize: 40,

  },
};
