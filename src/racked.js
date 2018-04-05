import React from 'react';
import http from 'http';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { EnvProvider } from './index';

const defaults = {
  run: http.createServer,
  handleError: (error, req, res) => {
    res.writeHead(500, error);
    res.end(JSON.stringify(error));
  },
};

// wrap an App component in a node/http-compatible function
// default server is node/http, but it works with express, etc
const racked = (App, options = defaults) =>
  options.run((req, res) => {
    const _racked_onError = error => options.handleError(error, req, res);
    return _racked_render({
      _racked_app: App,
      _racked_onError,
      _racked_store: {},
      req,
      res,
    });
  });

// render the racked App, passing this fn itself down as a render
// prop, so that components down the chain can instantiate Promises
// and re-call render with the promise results
const _racked_render = props => {
  const env = Object.assign(props, { _racked_render });
  return renderToString(
    <EnvProvider
      value={env}
      children={React.createElement(env._racked_app, env)}
    />
  );
};

export default racked;
