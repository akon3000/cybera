import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/Cybera/UserActivate')
        .then(cb)
        .catch(errorLoading);
};
