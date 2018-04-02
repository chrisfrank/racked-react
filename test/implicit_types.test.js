import React from 'react';
import request from 'supertest';
import createServer from './support/createServer';
import { Response } from '../src/index';

const App = () => <Response body="ok" />;

const server = createServer(App);

test('Implicit json', done =>
  request(server)
    .get('/')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(done));

test('Implicit json', done =>
  request(server)
    .get('/')
    .set('Accept', 'text/html')
    .expect('Content-Type', /html/)
    .end(done));
