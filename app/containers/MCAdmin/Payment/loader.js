import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Payment')
        .then(cb)
        .catch(errorLoading);
};
