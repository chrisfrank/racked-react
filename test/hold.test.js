import React from 'react';
import request from 'supertest';
import { Hold, Response, racked } from '../src/index';

const fakeFetch = key => () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(key);
    }, 100 * Math.random());
  });

const doubleFetch = () =>
  Promise.all([fakeFetch('george')(), fakeFetch('ringo')()]);

const App = () => (
  <Hold until={fakeFetch('john')()}>
    {john => (
      <Hold until={fakeFetch('paul')}>
        {paul => (
          <Hold until={doubleFetch}>
            {beatles => (
              <Response body={`${john} ${paul} ${beatles[0]} ${beatles[1]}`} />
            )}
          </Hold>
        )}
      </Hold>
    )}
  </Hold>
);

test(
  'Data loading',
  done => {
    request(racked(App).handler)
      .get('/')
      .expect(200, 'john paul george ringo')
      .end(done);
  },
  500
);

test('Error handling', done => {
  const ErrorApp = () => (
    <Hold until={() => new Promise((res, rej) => rej('nah'))}>
      {data => <Response body={data} />}
    </Hold>
  );
  request(racked(ErrorApp).handler)
    .get('/')
    .expect(500)
    .end(done);
});
