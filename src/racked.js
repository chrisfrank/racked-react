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
// sefault server is node/http, but it works with express, etc
const racked = (App, options = defaults) =>
  options.run((req, res) => {
    const onError = error => options.handleError(error, req, res);
    return call({ app: App, req, res, onError });
  });

// render the racked App, passing this `call` fn itself down as a render
// prop, so that components down the chain can instantiate Promises
// and re-call render with the promise results
const call = props => {
  const env = Object.assign(props, { call });
  return renderToString(
    <EnvProvider value={env} children={React.createElement(env.app, env)} />
  );
};

export default racked;
