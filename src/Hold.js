import React from 'react';
import { EnvConsumer, Response } from './index';

const Hold = ({ id, until, children }) => (
  <EnvConsumer>
    {env => {
      const data = env._racked_store[id];
      if (data) return children(data);

      until()
        .then(result => {
          // copy the store to a new object
          const _racked_store = Object.assign({}, env._racked_store);
          // store the promise result
          _racked_store[id] = result;
          // rerender the app with the new store
          const newProps = Object.assign({}, env, { _racked_store });
          env._racked_render(newProps);
        })
        .catch(env._racked_onError);

      return null;
    }}
  </EnvConsumer>
);

export default Hold;
