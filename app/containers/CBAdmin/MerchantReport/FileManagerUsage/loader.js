import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/FileManagerUsage')
        .then(cb)
        .catch(errorLoading);
};
