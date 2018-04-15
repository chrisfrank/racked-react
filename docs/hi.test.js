import React from 'react';
import request from 'supertest';
import { Response, racked } from '../src/index';

// an app that says hi
const App = ({ request }) => (
  <Response status={200} headers={{ 'X-Hello-From': 'racked-react' }}>
    <h1>Hello at {request.url}</h1>
  </Response>
);

test('It says hi', done => {
  request(racked(App))
    .get('/')
    .expect(200)
    .expect('X-Hello-From', 'racked-react')
    .end(done);
});
