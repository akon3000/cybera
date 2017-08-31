import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Footer/Footer1')
        .then(cb)
        .catch(errorLoading);
};
