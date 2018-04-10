import React from 'react';
import { matchBranch, matchMethod } from './utils';
import { EnvProvider, EnvConsumer } from '../index';

const Match = ({ path, children, config = {} }) => (
  <EnvConsumer>
    {env => {
      // Return null if another branch has claimed the request
      if (env._rack_branch) return null;

      // Return null if a method prop was passed and doesn't match
      if (!matchMethod(env, config.method)) return null;

      // Easy cases handled! Run the full match fn
      const branch = matchBranch(path, env, config);

      return branch ? Next({ env, branch, children }) : null;
    }}
  </EnvConsumer>
);

const Next = ({ env, branch, children }) => {
  // CLONE env for future modification by children
  const nextEnv = Object.assign({}, env, {
    branch: Object.assign({}, branch),
  });
  // MODIFY env to claim this branch request from siblings
  env._rack_branch = branch;

  // return children with cloned env in Context
  return (
    <EnvProvider value={nextEnv}>
      {typeof children === 'function' ? children(nextEnv) : children}
    </EnvProvider>
  );
};

export const Branch = ({ path, children }) => (
  <Match path={path} children={children} config={{ end: false }} />
);

export const Endpoint = ({ path, children, method }) => (
  <Match path={path} children={children} config={{ end: true, method }} />
);
