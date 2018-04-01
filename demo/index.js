import React from 'react';
import http from 'http';
import { Fetcher, Response, racked } from '../src';

const App = () => (
  <Fetcher id="jim">
    {data => {
      return <Response body={data} />;
    }}
  </Fetcher>
);

httj.createServer(racked(App)).listen(3000, '127.0.0.1');
