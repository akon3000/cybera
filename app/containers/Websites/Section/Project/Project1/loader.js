import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Project/Project1')
        .then(cb)
        .catch(errorLoading);
};
