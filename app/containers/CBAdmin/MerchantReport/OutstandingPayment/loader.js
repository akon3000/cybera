import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/OutstandingPayment')
        .then(cb)
        .catch(errorLoading);
};
