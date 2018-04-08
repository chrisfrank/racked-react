import React from 'react';
import http from 'http';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { EnvProvider } from './index';

const defaults = {
  run: http.createServer,
  handleError: (error, req, res) => {
    console.log(error);
    res.writeHead(500, error);
    res.end(JSON.stringify(error));
  },
};

// wrap an App component in a node/http-compatible function
// default server is node/http, but it works with express, etc
const racked = (App, options = defaults) =>
  options.run((req, res) => {
    const _rack_onError = error => options.handleError(error, req, res);
    return _rack_render({
      _rack_app: App,
      _rack_onError,
      _rack_store: [],
      req,
      res,
    });
  });

// render the racked App, passing this fn itself down as a render
// prop, so that components down the chain can instantiate Promises
// and re-call render with the promise results
const _rack_render = props => {
  const env = Object.assign({}, props, {
    _rack_render,
    _rack_holds: 0,
    _rack_branch: undefined,
  });
  return renderToString(
    <EnvProvider
      value={env}
      children={React.createElement(env._rack_app, env)}
    />
  );
};

export default racked;
