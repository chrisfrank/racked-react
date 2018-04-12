import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { EnvProvider } from './index';

// wrap an App component in a node/http-compatible function
// default server is node/http, but it works with express, etc
const racked = App => (req, res) =>
  _rack_render({
    _rack_app: App,
    _rack_store: [],
    req,
    res,
  });

// render the racked App, passing this fn itself down as a render
// prop, so that components down the chain can instantiate Promises
// and re-call render with the promise results
const _rack_render = props => {
  const env = Object.assign({}, props, {
    _rack_render,
    _rack_holds: 0,
    _rack_branch: null,
    branch: {},
  });
  renderToString(
    <EnvProvider
      value={env}
      children={React.createElement(env._rack_app, env)}
    />
  );
};

export default racked;
