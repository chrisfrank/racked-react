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
      if (data)
        return <EnvProvider value={next(env)} children={children(data)} />;

      Promise.resolve(typeof until === 'function' ? until() : until)
        .then(result => {
          // copy the store to a new object
          const store = Object.assign({}, _rack_store);
          // store the promise result
          store[_rack_holds] = result;
          const newProps = Object.assign({}, env, { _rack_store: store });
          console.log(newProps._rack_store);
          return env._rack_render(newProps);
        })
        .catch(env._rack_onError);

      return null;
    }}
  </EnvConsumer>
);

export default Hold;
