import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/Cybera/NewUser')
        .then(cb)
        .catch(errorLoading);
};
