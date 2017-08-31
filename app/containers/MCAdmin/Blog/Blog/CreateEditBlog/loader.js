import { errorLoading } from '../../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Blog/Blog/CreateEditBlog')
        .then(cb)
        .catch(errorLoading);
};
