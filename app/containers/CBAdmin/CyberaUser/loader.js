import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/CyberaUser')
        .then(cb)
        .catch(errorLoading);
};
