import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/PlanManagement')
        .then(cb)
        .catch(errorLoading);
};
