import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/CreateEditDiscount')
        .then(cb)
        .catch(errorLoading);
};
