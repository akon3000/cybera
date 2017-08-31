const content = `
  <h3 style="text-align: left;">This is the title your</h3>
  <p style="text-align: left;">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>
`;

export const initailContent = { content };

export default {
  name: 'FAQ',
  design: 'FAQ1',
  fluid: false,
  data: {
    title: '<h2 style="text-align: center; padding: 50px 0;">TITLE FAQ</h2>',
    faqList: [
      { id: 1, content },
      { id: 2, content },
      { id: 3, content },
    ],
  },
  setting: {
    title: {
      show: true,
      backgroundColor: '#e0e7f1',
    },
  },
};
