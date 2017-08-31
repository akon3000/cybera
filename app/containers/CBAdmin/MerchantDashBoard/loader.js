import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantDashBoard')
        .then(cb)
        .catch(errorLoading);
};
