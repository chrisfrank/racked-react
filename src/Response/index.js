import React from 'react';
import PropTypes from 'prop-types';
import { EnvConsumer } from '../index';

const defaultHeaders = {
  'Content-Type': 'text/plain',
};

const Response = ({ status, headers, body }) => (
  <EnvConsumer>
    {env => {
      env.res.writeHead(status, Object.assign({}, defaultHeaders, headers));
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
