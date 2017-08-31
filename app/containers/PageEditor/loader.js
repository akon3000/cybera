import { errorLoading, getAsyncInjectors } from '../../utils/asyncInjectors';

export default (store) => {
  const { injectReducer, injectSagas } = getAsyncInjectors(store);
  return (cb) => {
    const importModules = Promise.all([
      System.import('containers/PageEditor/reducer'),
      System.import('containers/PageEditor/sagas'),
      System.import('containers/PageEditor'),
    ]);

    importModules.then(([reducer, sagas, component]) => {
      injectReducer('pageEditor', reducer.default);
      injectSagas(sagas.default);
      cb(component);
    });

    importModules.catch(errorLoading);
  };
};
