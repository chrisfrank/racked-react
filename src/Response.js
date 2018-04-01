import React from 'react';
const PropTypes = require('prop-types');
import { EnvConsumer } from './index';

const Response = ({ status, headers, body }) => (
  <EnvConsumer>
    {env => {
      env.res.writeHead(200, headers);
      env.res.end(body);
      return null;
    }}
  </EnvConsumer>
);

Response.defaultProps = {
  status: 200,
  headers: {},
};

Response.propTypes = {
  status: PropTypes.number,
  headers: PropTypes.object,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

module.exports = Response;
