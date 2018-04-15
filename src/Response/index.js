import React from 'react';
import { EnvConsumer } from '../index';
import renderHeaders from './headers';
import renderBody from './body';

const Response = ({ status, headers, body, children, json }) => (
  <EnvConsumer>
    {env => {
      const { request, response } = env;
      const head = renderHeaders({ request, custom: headers, json });
      response.writeHead(status, head);
      response.end(
        renderBody({
          body,
          children,
          json,
          format: head['Content-Type'],
        })
      );
      return null;
    }}
  </EnvConsumer>
);

Response.defaultProps = {
  status: 200,
  headers: {},
};

module.exports = Response;
