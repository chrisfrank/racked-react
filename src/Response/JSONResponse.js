import React from 'react';
import Response from './index';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const JSONResponse = ({ status, headers = {}, body }) => (
  <Response
    status={status}
    headers={Object.assign({}, jsonHeaders, headers)}
    body={JSON.encode(body)}
  />
);

export default JSONResponse;
