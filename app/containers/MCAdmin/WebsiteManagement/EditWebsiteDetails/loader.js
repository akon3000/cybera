import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/WebsiteManagement/EditWebsiteDetails')
        .then(cb)
        .catch(errorLoading);
};
