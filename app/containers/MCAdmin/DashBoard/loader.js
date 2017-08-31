import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/DashBoard')
        .then(cb)
        .catch(errorLoading);
};
