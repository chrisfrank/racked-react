import React from 'react';
import request from 'supertest';
import { Response, racked } from '../src/index';

const rawString = '<h1>hello, world</h1>';
const jsxString = <h1>hello, world</h1>;
const renderedString = '<h1 data-reactroot="">hello, world</h1>';

describe('Response body', () => {
  test('as a "body" prop', done => {
    const App = () => <Response body={rawString} />;
    request(racked(App))
      .get('/')
      .expect(200, rawString)
      .end(done);
  });

  test('as a React children prop', done => {
    const App = () => <Response>{jsxString}</Response>;
    request(racked(App))
      .get('/')
      .expect(200, renderedString)
      .end(done);
  });
});

test('It renders children over body when both are specified', done => {
  const App = () => <Response body={rawString}>{jsxString}</Response>;
  request(racked(App))
    .get('/')
    .expect(200, renderedString)
    .end(done);
});

test('It render json over body when both are specified', done => {
  const App = () => <Response json={['hello']} body={rawString} />;
  request(racked(App))
    .get('/')
    .expect(200, ['hello'])
    .end(done);
});
