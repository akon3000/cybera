import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/DiscountDashBoard')
        .then(cb)
        .catch(errorLoading);
};
