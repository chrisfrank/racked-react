import React from 'react';
import { branchify, pathify } from './utils';
import { EnvProvider, EnvConsumer } from '../index';

const Match = ({ path, children, config = {} }) => (
  <EnvConsumer>
    {env => {
      const { method } = config;
      if (method && method.toUpperCase() !== env.req.method) return null;

      const pathToMatch = pathify(env._rack_branch, path);
      const branch = branchify(pathToMatch, env.req.url, config);

      return branch ? Next({ env, branch, children }) : null;
    }}
  </EnvConsumer>
);

const Next = ({ env, branch, children }) => {
  env._rack_branch = branch;
  return typeof children === 'function' ? children(branch) : children;
};

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
