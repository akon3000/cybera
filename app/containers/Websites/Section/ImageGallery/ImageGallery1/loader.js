import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/ImageGallery/ImageGallery1')
        .then(cb)
        .catch(errorLoading);
};
