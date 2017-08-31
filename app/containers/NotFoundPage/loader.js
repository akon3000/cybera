import { errorLoading } from '../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/NotFoundPage')
        .then(cb)
        .catch(errorLoading);
};
