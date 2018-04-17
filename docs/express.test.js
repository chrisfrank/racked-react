import React from 'react';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { db, migrate, seed, rollback } from '../test/db';
import { Hold, Response, racked } from '../src/index';

// an App that echoes back a request's JSON body
const App = ({ request }) => <Response json={request.body} />;

// node's `http` lib doesn't parse request bodies by default, so
// let's use express instead of http.createServer:

// instantiate express
const server = express();

// mount middleware for parsing JSON request bodies
server.use(bodyParser.json());

// map all incoming requests to our racked(App)
server.all('*', racked(App));

test('it parses JSON request bodies via express', done => {
  const data = { hello: 'world' };
  request(server)
    .post('/')
    .send(data)
    .expect(200, data)
    .end(done);
});
