import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/VerticalTab/VerticalTab1')
        .then(cb)
        .catch(errorLoading);
};
