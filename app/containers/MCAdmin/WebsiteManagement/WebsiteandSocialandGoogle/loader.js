import { errorLoading } from '../../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/WebsiteManagement/WebsiteandSocialandGoogle')
        .then(cb)
        .catch(errorLoading);
};
