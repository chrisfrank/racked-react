import React from 'react';
import PropTypes from 'prop-types';
import { EnvConsumer } from '../index';
import Headers from './Headers';
import Body from './Body';

const Response = ({ status, headers, body, children, json }) => (
  <EnvConsumer>
    {env => {
      const head = Headers({ req: env.req, custom: headers, json });
      env.res.writeHead(status, head);
      env.res.end(
        Body({ text: body || children, format: head['Content-Type'] })
      );
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
