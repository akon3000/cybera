import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Header/Header2')
        .then(cb)
        .catch(errorLoading);
};
