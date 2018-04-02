import React from 'react';
import request from 'supertest';
import createServer from './support/createServer';
import { Response } from '../src/index';

const App = () => <Response body="ok" />;

const server = createServer(App);

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
