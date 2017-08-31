import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  System.import('containers/MCAdmin/FileManager')
        .then(cb)
        .catch(errorLoading);
};
