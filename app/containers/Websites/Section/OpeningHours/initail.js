export default {
  name: 'OpeningHours',
  design: '', /** <--- should overide */
  designNumber: '', /** <--- should overide */
  fluid: false,
  data: {
    image: { url: null, link: { url: '', target: '_blank' } },
    openingHours: `
      <h3 style="text-align: center;">Opening hours</h3>
      <p style="padding: 15px 0 0; text-align: justify;">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at bibendum mi. Praesent eget purus magna. Nam ac egestas velit. Vestibulum rhoncus risus semper felis interdum, ac dignissim elit lobortis. Maecenas eu augue ac augue fermentum eleifend quis at sapien. Phasellus consequat, lectus a tristique ultrices, elit sapien efficitur eros, sed tincidunt enim nisl non ex. Vestibulum quam mi, laoreet vitae mattis non, fermentum sed libero.
      </p>
    `,
  },
  setting: {
    openingHours: true,
    image: true,
    style: {
      image: {
        height: 500,
      },
      openingHours: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderStyle: 'solid',
        padding: 30,
        maxWidth: 500,
        maxHeight: 400,
      },
    },
  },
};
