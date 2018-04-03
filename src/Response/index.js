import React from 'react';
import { EnvConsumer } from '../index';
import Headers from './Headers';
import Body from './Body';

const Response = ({ status, headers, body, children, json }) => (
  <EnvConsumer>
    {env => {
      const head = Headers({ req: env.req, custom: headers, json });
      env.res.writeHead(status, head);
      env.res.end(Body({ body, children, format: head['Content-Type'] }));
      return null;
    }}
  </EnvConsumer>
);

Response.defaultProps = {
  status: 200,
  headers: {},
};

module.exports = Response;
