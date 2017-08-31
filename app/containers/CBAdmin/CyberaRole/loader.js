import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/CyberaRole')
        .then(cb)
        .catch(errorLoading);
};
