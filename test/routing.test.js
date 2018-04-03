import React from 'react';
import { Route, Switch, StaticRouter } from 'react-router';
import request from 'supertest';
import { Response, racked } from '../src/index';

const Artists = () => <Response body="Artists" />;
const Root = () => <Response body="Root" />;

const App = props => (
  <StaticRouter location={props.req.url} context={props}>
    <Switch>
      <Route path="/artists" component={Artists} />
      <Route path="/" component={Root} />
    </Switch>
  </StaticRouter>
);

const app = racked(App);

test('Root', done => {
  request(app)
    .get('/')
    .then(res => {
      expect(res.text).toEqual('Root');
      done();
    });
});

test('Artists', done => {
  request(app)
    .get('/artists')
    .then(res => {
      expect(res.text).toEqual('Artists');
      done();
    });
});
