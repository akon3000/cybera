const content = `
  <h3 style="text-align: center; padding: 20px 0;">Name Lastname</h3>
  <p style="text-align: justify; font-size: 12px">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.  It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum</p>
`;
const image = { url: null, link: { url: '', target: '_blank' } };

export const initailContent = { content, image };

export default {
  name: 'Testimonials',
  design: 'Testimonials1',
  fluid: false,
  data: {
    title: '<h2 style="text-align: center; padding: 50px 0;">TESTIMONIAL</h2>',
    testimonialsList: [
      { id: 1, content, image },
      { id: 2, content, image },
      { id: 3, content, image },
    ],
  },
  setting: {
    title: {
      show: true,
      backgroundColor: '#e0e7f1',
    },
    imgSize: {
      width: 170,
      height: 170,
    },
  },
};
