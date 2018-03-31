import React from 'react';
const PropTypes = require('prop-types');
import { Consumer } from './Server';

const Response = ({ status, headers, body }) => (
  <Consumer>
    {res => {
      res.writeHead(status, headers);
      res.end(body);
      return null;
    }}
  </Consumer>
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
}

module.exports = Response;
