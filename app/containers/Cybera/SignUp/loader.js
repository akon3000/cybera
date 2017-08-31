import { errorLoading, getAsyncInjectors } from '../../../utils/asyncInjectors';

export default (store) => {
  const { injectReducer, injectSagas } = getAsyncInjectors(store);
  return (cb) => {
    const importModules = Promise.all([
      System.import('containers/Cybera/SignUp/reducer'),
      System.import('containers/Cybera/SignUp/sagas'),
      System.import('containers/Cybera/SignUp'),
    ]);

    importModules.then(([reducer, sagas, component]) => {
      injectReducer('signUp', reducer.default);
      injectSagas(sagas.default);
      cb(component);
    });

    importModules.catch(errorLoading);
  };
};
