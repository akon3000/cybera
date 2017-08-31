import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/PlanModification')
        .then(cb)
        .catch(errorLoading);
};
