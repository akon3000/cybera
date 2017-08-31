import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Staff')
        .then(cb)
        .catch(errorLoading);
};
