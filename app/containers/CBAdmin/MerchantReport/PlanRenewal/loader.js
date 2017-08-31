import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/PlanRenewal')
        .then(cb)
        .catch(errorLoading);
};
