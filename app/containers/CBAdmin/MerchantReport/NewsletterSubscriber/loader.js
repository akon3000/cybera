import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/MerchantReport/NewsletterSubscriber')
        .then(cb)
        .catch(errorLoading);
};
