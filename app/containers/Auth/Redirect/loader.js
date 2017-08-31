import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/Auth/Redirect')
        .then(cb)
        .catch(errorLoading);
};
