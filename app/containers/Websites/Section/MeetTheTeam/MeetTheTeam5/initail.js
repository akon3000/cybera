const content = `
  <h3>Name Lastname</h3>
  <p>Job Title</p>
`;

export const initailContent = { url: null, descrip: content, link: { url: '', target: '_blank' } };

export default {
  name: 'MeetTheTeam',
  design: 'MeetTheTeam5',
  fluid: false,
  data: {
    title: '<h2 style="padding: 50px 55px;">MEET THE TEAM</h2>',
    teamList: [
      { id: 1, ...initailContent },
      { id: 2, ...initailContent },
      { id: 3, ...initailContent },
    ],
  },
  setting: {
    title: {
      show: true,
      backgroundColor: '#e0e7f1',
    },
    imgSize: {
      width: 1000,
      height: 300,
    },
  },
};
