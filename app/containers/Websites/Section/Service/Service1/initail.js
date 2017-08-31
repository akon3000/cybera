const content = '<p style="text-align: justify;">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>';
const title = '<h3 style="padding: 0 15px 15px 15px;">This is the title your post</h3>';
const button = { content: 'Reading', link: { url: '', target: '_blank' } };
const image = { url: null, link: { url: '', target: '_blank' } };
export const initailContent = { content, title, button, image };

export default {
  name: 'Service',
  design: 'Service1',
  fluid: false,
  data: {
    serviceList: [
      { id: 1, ...initailContent },
      { id: 2, ...initailContent },
      { id: 3, ...initailContent },
      { id: 4, ...initailContent },
    ],
  },
  setting: {
    imgSize: {
      width: 1000,
      height: 200,
    },
    buttonStyle: {
      Normal: {
        fontFamily: 'Montserrat, sans-serif',
        color: '#FFF',
        backgroundColor: '#828080',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#828080',
        borderStyle: 'solid',
      },
      Active: {
      },
      Hover: {
      },
    },
  },
};
