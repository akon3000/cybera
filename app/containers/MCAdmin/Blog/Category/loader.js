import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Blog/Category')
        .then(cb)
        .catch(errorLoading);
};
