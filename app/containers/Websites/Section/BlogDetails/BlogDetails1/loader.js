import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/BlogDetails/BlogDetails1')
        .then(cb)
        .catch(errorLoading);
};
