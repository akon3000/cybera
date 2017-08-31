import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Project/Project3')
        .then(cb)
        .catch(errorLoading);
};
