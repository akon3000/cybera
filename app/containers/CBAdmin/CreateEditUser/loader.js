import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/CreateEditUser')
        .then(cb)
        .catch(errorLoading);
};
