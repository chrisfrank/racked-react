import React from 'react';
import { Route, Switch, StaticRouter } from 'react-router';
import request from 'supertest';
import createServer from './support/createServer';
import { Response } from '../src/index';

const App = props => (
  <StaticRouter location={props.req.url} context={props}>
    <Switch>
      <Route
        path="/json/header"
        render={() => (
          <Response
            body={['an', 'array', 'of', 'data']}
            headers={{ 'Content-Type': 'application/json' }}
          />
        )}
      />
      <Route
        path="/json/prop"
        render={() => <Response body={['an', 'array', 'of', 'data']} json />}
      />
      <Route
        path="/html"
        render={() => (
          <Response
            body="<h1>hello, world</h1>"
            headers={{ 'Content-Type': 'text/html' }}
          />
        )}
      />
      <Route
        path="/plain"
        render={() => (
          <Response
            body="hello, world"
            headers={{ 'Content-Type': 'text/plain' }}
          />
        )}
      />
    </Switch>
  </StaticRouter>
);

const server = createServer(App);

test(
  'JSON in content-type',
  done =>
    request(server)
      .get('/json/header')
      .expect('Content-Type', /json/)
      .then(res => {
        expect(typeof res.body).toEqual('object');
        return done();
      }),
  100
);

test(
  'JSON as a prop',
  done =>
    request(server)
      .get('/json/prop')
      .expect('Content-Type', /json/)
      .then(res => {
        expect(typeof res.body).toEqual('object');
        return done();
      }),
  100
);

test('plain text', done =>
  request(server)
    .get('/plain')
    .expect('Content-Type', /plain/)
    .end(done));

test('html', done =>
  request(server)
    .get('/html')
    .expect('Content-Type', /html/)
    .expect(200, '<h1>hello, world</h1>')
    .end(done));
