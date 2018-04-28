import React from 'react';
import { createServer } from 'http';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { EnvProvider } from './index';

// wrap an App component in a node/http-compatible function
const racked = App => {
  const handler = (request, response) =>
    rackRender({ _rack_app: App, request, response });

  const listen = () => createServer(handler).listen(arguments);

  return { handler, listen };
};

// render the racked App, passing this fn itself down as a render
// prop, so that components down the chain can instantiate Promises
// and re-call render with the promise results
const rackRender = props => {
  const env = Object.assign({ _rack_store: [] }, props, {
    _rack_render: rackRender,
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
