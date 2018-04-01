import React from 'react';
import { EnvConsumer } from './index';

const Fetcher = ({ children, id }) => (
  <EnvConsumer>
    {env => {
      const data = env[id];
      if (data) return children(data);
      setTimeout(() => {
        const newProps = Object.assign(env, { [id]: id });
        env.call(newProps);
      }, 100 * Math.random());
      return null;
    }}
  </EnvConsumer>
);

export default Fetcher;
