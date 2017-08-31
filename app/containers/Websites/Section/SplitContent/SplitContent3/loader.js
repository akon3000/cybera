import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/SplitContent/SplitContent3')
        .then(cb)
        .catch(errorLoading);
};
