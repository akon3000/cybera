import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/Cybera/PublicComment')
        .then(cb)
        .catch(errorLoading);
};
