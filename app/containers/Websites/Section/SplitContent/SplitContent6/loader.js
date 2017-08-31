import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/SplitContent/SplitContent6')
        .then(cb)
        .catch(errorLoading);
};
