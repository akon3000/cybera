const content = `
  <h3>This is the title your</h3>
  <p style="text-align: justify;">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
`;
const image = { url: null, link: { url: '', target: '_blank' } };
const button = { content: 'Read more', link: { url: '', target: '_blank' } };

export const initailContent = { content, image, button };

export default {
  name: 'Project',
  design: '', /** <--- should overide */
  designNumber: '', /** <--- should overide */
  fluid: false,
  data: {
    title: '<h2 style="text-align: center; padding: 50px 0; margin: 0;">PROJECT TITLE</h2>',
    projectList: [
      { id: 1, content, image, button },
      { id: 2, content, image, button },
    ],
  },
  setting: {
    title: {
      show: true,
      backgroundColor: '#e0e7f1',
    },
    imgSize: {
      width: 1000,
      height: 400,
    },
    buttonStyle: {
      Normal: {
        fontFamily: 'Montserrat, sans-serif',
        color: '#DDD',
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DDD',
        borderStyle: 'solid',
      },
      Active: {
      },
      Hover: {
      },
    },
  },
};
