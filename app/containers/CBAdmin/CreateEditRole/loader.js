import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/CreateEditRole')
        .then(cb)
        .catch(errorLoading);
};
