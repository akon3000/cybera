import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Banner/Banner2')
        .then(cb)
        .catch(errorLoading);
};
