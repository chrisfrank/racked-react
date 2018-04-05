import React from 'react';
import { EnvConsumer } from './index';

const Redirect = ({ status = 301, headers = {}, to }) => (
  <EnvConsumer>
    {env => {
      const h = Object.assign({}, headers, { Location: to });
      env.res.writeHead(status, h);
      env.res.end();
    }}
  </EnvConsumer>
);

export default Redirect;
