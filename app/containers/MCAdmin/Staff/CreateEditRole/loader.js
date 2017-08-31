import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Staff/CreateEditRole')
        .then(cb)
        .catch(errorLoading);
};
