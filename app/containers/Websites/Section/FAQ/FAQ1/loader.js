import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/FAQ/FAQ1')
        .then(cb)
        .catch(errorLoading);
};
