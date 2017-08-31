import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/MeetTheTeam/MeetTheTeam5')
        .then(cb)
        .catch(errorLoading);
};
