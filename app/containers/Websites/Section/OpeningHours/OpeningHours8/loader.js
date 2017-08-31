import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/OpeningHours/OpeningHours8')
        .then(cb)
        .catch(errorLoading);
};
