export function mergeReducers(store, action, reducers = []) {
  let state = store;
  reducers.forEach((reducer) => {
    state = reducer(state, action);
  });

  return state;
}
