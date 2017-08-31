import { errorLoading } from '../../../utils/asyncInjectors';

export default () => (cb) => {
  const importModules = Promise.all([
    System.import('containers/Cybera/Home'),
  ]);

  importModules.then(([component]) => {
    cb(component);
  });

  importModules.catch(errorLoading);
};
