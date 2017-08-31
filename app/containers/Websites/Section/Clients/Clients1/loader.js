import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/Clients/Clients1')
        .then(cb)
        .catch(errorLoading);
};
