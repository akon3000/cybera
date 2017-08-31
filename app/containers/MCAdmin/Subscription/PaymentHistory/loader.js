import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Subscription/PaymentHistory')
        .then(cb)
        .catch(errorLoading);
};
