import pathToRegExp from 'path-to-regexp';

// attempt to parse URL into a new route branch, and return null on failure
export const branchify = (path = '', url, options = {}) => {
  let keys = [];
  const match = pathToRegExp(path, keys, options).exec(url);
  if (!match) return null;
  if (options.exact && path !== url) return null;

  const params = keys.reduce((memo, key, index) => {
    const val = match[index + 1];
    if (val !== undefined) memo[key.name] = val;
    return memo;
  }, {});

  return { url: match[0], params };
};

export const pathify = (branch, path) => {
  const prefix = branch ? branch.url : '';
  const suffix = path || '';
  return prefix + suffix;
};
