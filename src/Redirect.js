import React from 'react';
import { EnvConsumer } from './index';

const Redirect = ({ status = 301, headers = {}, to }) => (
  <EnvConsumer>
    {env => {
      const h = Object.assign({}, headers, { Location: to });
      const { response } = env;
      response.writeHead(status, h);
      response.end();
    }}
  </EnvConsumer>
);

export default Redirect;
