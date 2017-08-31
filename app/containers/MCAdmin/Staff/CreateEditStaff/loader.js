import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/Staff/CreateEditStaff')
        .then(cb)
        .catch(errorLoading);
};
