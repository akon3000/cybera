import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/GoogleMap/GoogleMap1')
        .then(cb)
        .catch(errorLoading);
};
