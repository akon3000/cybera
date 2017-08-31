import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/ExtensionPurchased')
        .then(cb)
        .catch(errorLoading);
};
