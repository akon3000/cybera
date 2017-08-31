const content = `
  <h3>This is title your</h3>
  <p style="text-align: justify; padding: 15px 0; font-size: 12px">Curabitur vehicula ornare magna, et auctor sem tincidunt non. Nulla facilisi. Pellentesque vitae ipsum enim. Ut aliquam felis eu pulvinar pulvinar. Morbi finibus vel neque ut maximus. Nam commodo sed mauris non tincidunt. Morbi sit amet lobortis quam, quis pharetra ipsum. Cras quis efficitur lorem. Morbi mattis sollicitudin ex, ut eleifend lorem ornare quis. Sed eget mauris quis libero ultrices commodo ut non odio. Nullam pretium mollis ipsum ut vehicula. Fusce iaculis justo vitae massa sagittis, id auctor quam aliquam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis mollis ex id fringilla faucibus. Nunc mattis placerat ultrices.</p>
`;

export default {
  name: 'SplitContent',
  design: 'SplitContent3',
  fluid: false,
  data: {
    colum: [
      { id: 1, content },
      { id: 2, content },
      { id: 3, content },
      { id: 4, content },
      { id: 5, content },
      { id: 6, content },
    ],
  },
  setting: {},
};

export const initailContent = content;
