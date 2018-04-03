import React from 'react';
import request from 'supertest';
import createServer from './support/createServer';
import { Fetcher, Response } from '../src/index';

const fakeFetch = key => () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(key);
    }, 100 * Math.random());
  });

const App = () => (
  <Fetcher id="lennon" query={fakeFetch('lennon')}>
    {john => (
      <Fetcher id="mccartney" query={fakeFetch('mccartney')}>
        {paul => <Response body={`${john} ${paul}`} />}
      </Fetcher>
    )}
  </Fetcher>
);

test(
  'Data loading',
  done => {
    const server = createServer(App);
    return request(server)
      .get('/')
      .expect(200, 'lennon mccartney')
      .end(done);
  },
  500
);

test(
  'Error handling',
  done => {
    const ErrorApp = () => (
      <Fetcher query={() => new Promise((res, rej) => rej('nah'))} id="jim">
        {data => <Response body={data} />}
      </Fetcher>
    );
    const server = createServer(ErrorApp);
    return request(server)
      .get('/')
      .expect(500)
      .end(done);
  },
  500
);
