import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/HorizontalTab/HorizontalTab1')
        .then(cb)
        .catch(errorLoading);
};
