import React from 'react';
import pathToRegExp from 'path-to-regexp';
import { EnvProvider, EnvConsumer } from './index';

const defaults = {
  end: false,
  exact: false,
};

const parsePath = (path = '', url, options = {}) => {
  let keys = [];
  const opts = Object.assign({}, defaults, options);
  const match = pathToRegExp(path, keys, opts).exec(url);
  if (!match) return null;

  const isExact = path === url;
  if (options.exact && !isExact) return null;

  const params = keys.reduce((memo, key, index) => {
    const val = match[index + 1];
    if (val !== undefined) memo[key.name] = val;
    return memo;
  }, {});

  return { url: match[0], isExact, params };
};

const Match = ({ path, method, children, exact }) => (
  <EnvConsumer>
    {env => {
      if (method && method.toUpperCase() !== env.req.method) return null;
      if (!path) return Next({ env, children });

      const pathToMatch = env.branch ? `${env.branch.url}${path}` : path;
      const match = parsePath(pathToMatch, env.req.url, { exact });

      return match ? Next({ env, match, children }) : null;
    }}
  </EnvConsumer>
);

const Next = ({ env, match, children }) => (
  <EnvProvider value={Object.assign({}, env, { branch: match })}>
    {typeof children === 'function' ? children(match) : children}
  </EnvProvider>
);

export default Match;
