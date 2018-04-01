import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { EnvProvider } from './index';

// wrap an App component, passing http's req and res objects as props
const racked = App => (req, res) => call({ app: App, req, res });

// render the racked App, passing this `call` fn itself down as a render
// prop, so that components down the chain can instantiate Promises
// and re-call render with the promise results
const call = props => {
  const env = Object.assign(props, { call });
  renderToString(
    <EnvProvider value={env} children={React.createElement(env.app, env)} />
  );
};

export default racked;
