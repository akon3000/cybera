import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/TotalSpending')
        .then(cb)
        .catch(errorLoading);
};
