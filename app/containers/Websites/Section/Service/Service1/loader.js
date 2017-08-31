import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Service/Service1')
        .then(cb)
        .catch(errorLoading);
};
