import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/User/UpdateProfile')
        .then(cb)
        .catch(errorLoading);
};
