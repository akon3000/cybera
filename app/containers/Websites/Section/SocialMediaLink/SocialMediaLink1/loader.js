import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/SocialMediaLink/SocialMediaLink1')
        .then(cb)
        .catch(errorLoading);
};
