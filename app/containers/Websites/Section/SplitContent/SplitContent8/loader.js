import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/SplitContent/SplitContent8')
        .then(cb)
        .catch(errorLoading);
};
