const content = `
  <h3 style="padding: 15px 0;">This is title your</h3>
  <p style="text-align: justify; padding: 15px 0; font-size: 12px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lobortis nunc eu nibh sagittis commodo nec placerat nisi. Sed cursus nisl id ligula lobortis egestas. Phasellus venenatis varius nisl, a viverra ante consequat id. Pellentesque ac odio feugiat est fringilla elementum. Sed vestibulum quam vel mauris vulputate scelerisque. Vestibulum ut augue quis lorem efficitur pharetra. Suspendisse eu volutpat ligula. Vivamus ullamcorper ac ligula in bibendum. Suspendisse ac justo ornare, ultricies sapien a, euismod risus. Duis porta sollicitudin magna. Vivamus dolor turpis, ultricies non dui quis, vehicula pretium dolor. Suspendisse potenti. Aliquam egestas at nibh at tempor. Curabitur ornare suscipit massa sed tempor. Pellentesque condimentum, quam at lobortis dignissim, lorem mi pulvinar neque, vitae porta lectus urna ut ex. Pellentesque vitae turpis lectus. Nunc tincidunt consectetur consequat. Nunc dignissim neque quis sem luctus vulputate nec at mauris. Vestibulum non euismod ipsum, a dapibus diam. Aliquam feugiat, nulla et aliquam tristique, arcu magna blandit velit, in rutrum ipsum massa et nibh. Vivamus elementum varius ligula eu eleifend. Quisque ullamcorper orci ac elit bibendum mollis. Aliquam venenatis purus ut lectus bibendum, eu imperdiet lacus sagittis. In sollicitudin tortor sit amet nulla sagittis, sed luctus elit dapibus. Donec tempus lobortis ipsum semper tristique. Mauris pharetra nunc orci, sed elementum risus dictum ac. Donec ullamcorper dolor leo, eu dignissim ex lacinia commodo. Aliquam eu faucibus tortor. Pellentesque cursus magna nec faucibus ullamcorper. Ut porttitor purus diam, in tristique ligula posuere in. Aliquam vel dignissim nisl. Integer tellus orci, vulputate vitae cursus nec, consequat eu enim. Sed vehicula sem sed vehicula vestibulum. Donec ut pulvinar risus. Vestibulum massa dui, tempor sit amet fringilla et, convallis quis purus. Maecenas at bibendum purus. Vivamus eget pretium lorem. Aliquam ex velit, cursus nec blandit vel, tempus non leo.</p>
`;

export default {
  name: 'SplitContent',
  design: 'SplitContent8',
  fluid: false,
  data: {
    colum: [
      { id: 1, content },
      { id: 2, content },
    ],
  },
  setting: {},
};

export const initailContent = content;
