import React from 'react';
import { EnvConsumer, EnvProvider, Response } from './index';

const next = (env, store) =>
  Object.assign({}, env, {
    _rack_holds: env._rack_holds + 1,
    _rack_store: store || env._rack_store,
  });

const Hold = ({ until, children }) => (
  <EnvConsumer>
    {env => {
      const { _rack_holds, _rack_store } = env;
      const data = _rack_store[_rack_holds];
      if (data) return Next({ data, children, env });

      Promise.resolve(typeof until === 'function' ? until() : until)
        .then(result => {
          // copy the store to a new object
          const store = Object.assign({}, _rack_store);
          // store the promise result
          store[_rack_holds] = result;
          env._rack_render(next(env, store));
        })
        .catch(env._rack_onError);

      return null;
    }}
  </EnvConsumer>
);

const Next = ({ data, children, env }) => (
  <EnvProvider
    value={next(env)}
    children={typeof children === 'function' ? children(data) : children}
  />
);

export default Hold;
