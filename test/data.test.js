import React from 'react';
import request from 'supertest';
import createServer from './support/createServer';
import { Fetcher, Response } from '../src/index';

const App = () => (
  <Fetcher id="lennon">
    {john => (
      <Fetcher id="mccartney">
        {paul => <Response body={`${john} ${paul}`} />}
      </Fetcher>
    )}
  </Fetcher>
);

const server = createServer(App);

test(
  'Data loading',
  done =>
    request(server)
      .get('/')
      .expect(200, 'lennon mccartney')
      .end(done),
  500
);
