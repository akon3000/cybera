import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Blog/Settings')
        .then(cb)
        .catch(errorLoading);
};
