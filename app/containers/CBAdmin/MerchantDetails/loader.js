import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantDetails')
        .then(cb)
        .catch(errorLoading);
};
