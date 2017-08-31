import { errorLoading } from '../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/AccessDenied')
        .then(cb)
        .catch(errorLoading);
};
