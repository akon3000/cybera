import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Testimonials/Testimonials1')
        .then(cb)
        .catch(errorLoading);
};
