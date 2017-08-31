import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Auth')
        .then(cb)
        .catch(errorLoading);
};
