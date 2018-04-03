import React from 'react';
import { EnvConsumer, Response } from './index';

const Hold = ({ id, until, children }) => (
  <EnvConsumer>
    {env => {
      const data = env[id];
      if (data) return children(data);

      until()
        .then(result => {
          const newProps = Object.assign({}, env, { [id]: result });
          env.call(newProps);
        })
        .catch(env.onError);

      return null;
    }}
  </EnvConsumer>
);

export default Hold;
