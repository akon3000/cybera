import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Subscription')
        .then(cb)
        .catch(errorLoading);
};
