import { errorLoading } from '../../../../../utils/asyncInjectors';

export default (cb) => {
  System.import('containers/Websites/Section/ImageSlider/ImageSlider2')
        .then(cb)
        .catch(errorLoading);
};
