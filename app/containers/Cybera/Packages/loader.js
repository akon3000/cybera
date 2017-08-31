import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/Cybera/Packages')
        .then(cb)
        .catch(errorLoading);
};
