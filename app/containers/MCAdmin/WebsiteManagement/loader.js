import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/WebsiteManagement')
        .then(cb)
        .catch(errorLoading);
};
