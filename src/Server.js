import React, { createContext } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

const { Provider, Consumer } = createContext();

const ServerRouter = App => (req, res) => (
  renderToString(
    <Provider value={res}>
      <StaticRouter location={req.url} context={{}}>
        <App />
      </StaticRouter>
    </Provider>
  )
);

export default ServerRouter;
export { Consumer };
