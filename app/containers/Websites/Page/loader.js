import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/Websites/Page')
        .then(cb)
        .catch(errorLoading);
};
