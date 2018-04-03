import React from 'react';
import { Route, Switch, StaticRouter } from 'react-router';
import request from 'supertest';
import { Response, racked } from '../src/index';

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
        path="/html/body"
        render={() => (
          <Response
            body="<h1>hello, world</h1>"
            headers={{ 'Content-Type': 'text/html' }}
          />
        )}
      />
      <Route
        path="/html/children"
        render={() => (
          <Response headers={{ 'Content-Type': 'text/html' }}>
            <h1>hello, world</h1>
          </Response>
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

const app = racked(App);

test(
  'JSON in content-type',
  done =>
    request(app)
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
    request(app)
      .get('/json/prop')
      .expect('Content-Type', /json/)
      .then(res => {
        expect(typeof res.body).toEqual('object');
        return done();
      }),
  100
);

test('plain text', done =>
  request(app)
    .get('/plain')
    .expect('Content-Type', /plain/)
    .end(done));

test('html body', done =>
  request(app)
    .get('/html/body')
    .expect('Content-Type', /html/)
    .expect(200, '<h1>hello, world</h1>')
    .end(done));

test('html children', done =>
  request(app)
    .get('/html/children')
    .expect('Content-Type', /html/)
    .expect(200, '<h1 data-reactroot="">hello, world</h1>')
    .end(done));
