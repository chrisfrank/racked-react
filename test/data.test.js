import React from 'react';
import request from 'supertest';
import { Hold, Response, racked } from '../src/index';

const fakeFetch = key => () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(key);
    }, 100 * Math.random());
  });

const App = () => (
  <Hold id="john" until={fakeFetch('lennon')}>
    {john => (
      <Hold id="paul" until={fakeFetch('mccartney')}>
        {paul => <Response body={`${john} ${paul}`} />}
      </Hold>
    )}
  </Hold>
);

test(
  'Data loading',
  done => {
    return request(racked(App))
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
      <Hold until={() => new Promise((res, rej) => rej('nah'))} id="jim">
        {data => <Response body={data} />}
      </Hold>
    );
    return request(racked(ErrorApp))
      .get('/')
      .expect(500)
      .end(done);
  },
  500
);
