import React from 'react';
import request from 'supertest';
import { Redirect, Response, racked } from '../src/index';

const url = 'http://www.thefutureproject.org/';
const Red = () => <Redirect to={url} />;
const Res = () => <Response headers={{ Location: url }} status={301} />;

test('Redirect via component', done => {
  request(racked(Red))
    .get('/')
    .expect(301)
    .expect('Location', url)
    .end(done);
});

test('Redirects via headers', done => {
  request(racked(Res))
    .get('/')
    .expect(301)
    .expect('Location', url)
    .end(done);
});
