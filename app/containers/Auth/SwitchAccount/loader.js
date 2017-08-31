import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/Auth/SwitchAccount')
        .then(cb)
        .catch(errorLoading);
};
