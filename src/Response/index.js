import React from 'react';
import { EnvConsumer } from '../index';
import renderHeaders from './renderHeaders';
import renderBody from './renderBody';

const Response = ({
  status,
  headers,
  body,
  children,
  prefix,
  suffix,
  json,
}) => (
  <EnvConsumer>
    {env => {
      const { request, response } = env;
      const head = renderHeaders({ request, custom: headers, json });
      response.writeHead(status, head);
      if (prefix) response.write(prefix);
      response.write(
        renderBody({
          body,
          children,
          json,
          format: head['Content-Type'],
        })
      );
      return response.end(suffix);
    }}
  </EnvConsumer>
);

Response.defaultProps = {
  status: 200,
  headers: {},
  body: '',
};

module.exports = Response;
