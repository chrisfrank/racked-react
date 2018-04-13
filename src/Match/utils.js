import url from 'url';
import pathToRegExp from 'path-to-regexp';

// attempt to parse URL into a new route branch, and return null on failure
export const matchBranch = (path = '', env, options = {}) => {
  let keys = [];
  const fullPath = expandPath(env.branch.path, path);
  const { pathname } = url.parse(env.req.url);
  const match = pathToRegExp(fullPath, keys, options).exec(pathname);
  if (!match) return null;

  const params = keys.reduce((memo, key, index) => {
    const val = match[index + 1];
    if (val !== undefined) memo[key.name] = val;
    return memo;
  }, env.branch.params || {});

  return { params, path: fullPath };
};

export const expandPath = (prefix = '', suffix = '') => prefix.concat(suffix);

export const matchMethod = (env, method) => {
  return !method || method.toUpperCase() === env.req.method;
};
