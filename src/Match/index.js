import React from 'react';
import { branchify, pathify } from './utils';
import { EnvProvider, EnvConsumer } from '../index';

const Match = ({ path, children, config = {} }) => (
  <EnvConsumer>
    {env => {
      const { method } = config;
      if (method && method.toUpperCase() !== env.req.method) return null;

      if (!path && !config.exact) return Next({ env, children });

      const pathToMatch = pathify(env.branch, path);
      const branch = branchify(pathToMatch, env.req.url, config);

      return branch ? Next({ env, branch, children }) : null;
    }}
  </EnvConsumer>
);

const Next = ({ env, branch, children }) => (
  <EnvProvider value={Object.assign({}, env, { branch })}>
    {typeof children === 'function' ? children(branch) : children}
  </EnvProvider>
);

export const Branch = ({ path, children }) => (
  <Match path={path} children={children} config={{ end: false }} />
);

export const Endpoint = ({ path, children, method }) => (
  <Match
    path={path}
    children={children}
    config={{ end: true, exact: true, method }}
  />
);
