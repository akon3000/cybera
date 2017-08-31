import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/BlogList/BlogList3')
        .then(cb)
        .catch(errorLoading);
};
