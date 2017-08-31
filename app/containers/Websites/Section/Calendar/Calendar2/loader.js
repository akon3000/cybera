import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Calendar/Calendar2')
        .then(cb)
        .catch(errorLoading);
};
