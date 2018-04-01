import React from 'react';
import http from 'http';
import request from 'supertest';
import { Fetcher, Response, racked } from '../src/index';

const App = () => (
  <Fetcher id="lennon">
    {john => (
      <Fetcher id="mccartney">
        {paul => <Response body={`${john} ${paul}`} />}
      </Fetcher>
    )}
  </Fetcher>
);

const server = http.createServer(racked(App));

test(
  'Data loading',
  done => {
    return request(server)
      .get('/')
      .then(res => {
        expect(res.text).toEqual('lennon mccartney');
        done();
      });
  },
  500
);
