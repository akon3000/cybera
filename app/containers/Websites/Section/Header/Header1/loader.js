import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Header/Header1')
        .then(cb)
        .catch(errorLoading);
};
