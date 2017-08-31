import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/Registration')
        .then(cb)
        .catch(errorLoading);
};
