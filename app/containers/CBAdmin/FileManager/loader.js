import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/CBAdmin/FileManager')
        .then(cb)
        .catch(errorLoading);
};
