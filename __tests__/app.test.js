import React, { Fragment } from 'react';
import ServerRouter from '../src/Server';
import Response from '../src/Response';
import { Route, Switch } from 'react-router';
import http from 'http';
import request from 'supertest';

const Artists = () => <Response body="Artists" />

const Root = props => {
  return <Response {...props} body="Root" />
}

const App = ({ req, res }) => (
  <Switch>
    <Route path="/artists" component={Artists} />
    <Route path="/" component={Root} />
  </Switch>
);

const server = http.createServer(ServerRouter(App))

test('server', done => {
  expect.assertions(1);
  request(server).get('/').then(res => {
    expect(res.text).toEqual("Root");
    done();
  }).catch(err => {
    console.log(err)
  });
});
