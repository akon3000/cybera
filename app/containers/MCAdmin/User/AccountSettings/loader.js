import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/User/AccountSettings')
        .then(cb)
        .catch(errorLoading);
};
