import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/WebsiteDashBoard')
        .then(cb)
        .catch(errorLoading);
};
