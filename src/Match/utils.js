import pathToRegExp from 'path-to-regexp';

// attempt to parse URL into a new route branch, and return null on failure
export const matchBranch = (path = '', env, options = {}) => {
  let keys = [];
  const match = pathToRegExp(
    fullPath(env._rack_branches, path),
    keys,
    options
  ).exec(env.req.url);
  if (!match) return null;

  const params = keys.reduce((memo, key, index) => {
    const val = match[index + 1];
    if (val !== undefined) memo[key.name] = val;
    return memo;
  }, {});

  return { url: match[0], params };
};

export const fullPath = (branch, path) => {
  const prefix = branch.length > 0 ? branch[branch.length - 1].url : '';
  const suffix = path || '';
  return prefix + suffix;
};

export const matchMethod = (env, method) => {
  return !method || method.toUpperCase() === env.req.method;
};
