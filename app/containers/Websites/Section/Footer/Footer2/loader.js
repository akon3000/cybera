import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Footer/Footer2')
        .then(cb)
        .catch(errorLoading);
};
