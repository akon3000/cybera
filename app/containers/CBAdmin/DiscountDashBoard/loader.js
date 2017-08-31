import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/DiscountDashBoard')
        .then(cb)
        .catch(errorLoading);
};
