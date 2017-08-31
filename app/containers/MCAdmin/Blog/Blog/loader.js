import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Blog/Blog')
        .then(cb)
        .catch(errorLoading);
};
