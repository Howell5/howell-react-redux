const createStore = (reducer, enhance) => {
  if (enhance) {
    return enhance(createStore)(reducer);
  }
  let currentState = {};
  const listeners = [];

  const getState = () => currentState;

  const subscribe = listener => {
    listeners.push(listener);
  };

  const dispatch = action => {
    currentState = reducer(currentState, action);
    listeners.forEach(v => v());
    return action;
  };
  dispatch({ type: '@INIT/howell-redux' });
  return { getState, dispatch, subscribe };
};

const compose = (...funcs) => {
  if (funcs.length === 0) {
    return args => args;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((acc, cur) => (...args) => acc(cur(...args)));
};

const applyMiddleware = (...middlewares) => createStore => (...args) => {
  const store = createStore(...args);
  let dispatch = store.dispatch;
  const middleApi = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args)
  };

  const middlewareChain = middlewares.map(middleware => middleware(middleApi));
  dispatch = compose(...middlewareChain)(dispatch);

  return {
    ...store,
    dispatch
  };
};

// compose(fn1, fn2, fn3) -> fn1(fn2(fn3))

const bindActionCreator = (creator, dispatch) => (...args) =>
  dispatch(creator(...args));

// {addGun: addGun} -> {addGun: (...args) => store.dispatch(addGun(...args))}
const bindActionCreators = (creators, dispatch) =>
  Object.keys(creators).reduce((acc, cur) => {
    acc[cur] = bindActionCreator(creators[cur], dispatch);
    return acc;
  }, {});

export { createStore, bindActionCreators, applyMiddleware };
