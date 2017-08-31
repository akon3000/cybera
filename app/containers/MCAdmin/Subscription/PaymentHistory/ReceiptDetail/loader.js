import { errorLoading } from '../../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Subscription/PaymentHistory/ReceiptDetail')
        .then(cb)
        .catch(errorLoading);
};
