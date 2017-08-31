import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/CreateEditDiscount')
        .then(cb)
        .catch(errorLoading);
};
