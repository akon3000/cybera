import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Blog/Comment')
        .then(cb)
        .catch(errorLoading);
};
