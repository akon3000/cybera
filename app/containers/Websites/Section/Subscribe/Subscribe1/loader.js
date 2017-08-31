import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Subscribe/Subscribe1')
        .then(cb)
        .catch(errorLoading);
};
