import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/AboutUs/AboutUs1')
        .then(cb)
        .catch(errorLoading);
};
