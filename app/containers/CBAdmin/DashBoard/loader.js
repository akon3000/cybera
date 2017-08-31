import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/DashBoard')
        .then(cb)
        .catch(errorLoading);
};
