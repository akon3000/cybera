import { errorLoading } from '../../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Blog/Category/CreateEditCategory')
        .then(cb)
        .catch(errorLoading);
};
