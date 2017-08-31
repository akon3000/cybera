import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/PlanSubscriptionCancellation')
        .then(cb)
        .catch(errorLoading);
};
