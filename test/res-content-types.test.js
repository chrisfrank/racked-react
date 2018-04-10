import React from 'react';
import request from 'supertest';
import { Response, racked } from '../src/index';

const data = ['hello', 'world'];

describe('Response content types', () => {
  describe('via http Accept header', () => {
    const App = () => <Response body={JSON.stringify('ok')} />;
    const server = racked(App);

    test('It returns JSON when asked', done =>
      request(server)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(done));

    test('it returns html when asked', done =>
      request(server)
        .get('/hello.html')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .end(done));

    test('It returns text/plain by default', done =>
      request(server)
        .get('/hello.html')
        .expect('Content-Type', /plain/)
        .end(done));
  });

  describe('via server-side settings', () => {
    test('http header', done => {
      const App = () => (
        <Response
          body={JSON.stringify(data)}
          headers={{ 'Content-Type': 'application/json' }}
        />
      );
      request(racked(App))
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200, data)
        .end(done);
    });

    test('json prop', done => {
      const App = () => <Response json={data} />;
      request(racked(App))
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200, data)
        .end(done);
    });
  });
});
