import React from 'react';
import http from 'http';
import request from 'supertest';
import { Branch, Endpoint, racked } from '../../src';
import { migrate, rollback, seed } from '../db';
import Create from './Create';
import Read from './Read';
import Update from './Update';
import Destroy from './Destroy';
import List from './List';

const App = () => (
  <Branch path="/artists">
    <Endpoint method="GET">{List}</Endpoint>
    <Endpoint method="POST">{Create}</Endpoint>
    <Branch path="/:id">
      <Endpoint method="GET">{Read}</Endpoint>
      <Endpoint method="PATCH">{Update}</Endpoint>
      <Endpoint method="DELETE">{Destroy}</Endpoint>
    </Branch>
  </Branch>
);

const app = racked(App);

beforeEach(migrate);
beforeEach(seed);
afterEach(rollback);

test('CREATE', done => {
  request(app)
    .post('/artists')
    .send({ name: 'Chris Frank', genre: 'alt' })
    .then(res => {
      expect(res.body.name).toEqual('Chris Frank');
      done();
    });
});

test('READ', done => {
  request(app)
    .get('/artists/3')
    .then(res => {
      expect(res.body.name).toEqual('James Blake');
      done();
    });
});

test('UPDATE', done => {
  request(app)
    .patch('/artists/3')
    .send({ name: 'James Brown' })
    .then(res => {
      expect(res.body.name).toEqual('James Brown');
      done();
    });
});

test('DELETE', done => {
  request(app)
    .delete('/artists/3')
    .expect(204)
    .end(done);
});

test('LIST with an empty query string', done => {
  request(app)
    .get('/artists')
    .then(res => {
      expect(res.body.length).toEqual(5);
      done();
    });
});

test('LIST with query', done => {
  request(app)
    .get('/artists?genre=electronic')
    .then(res => {
      expect(res.body.length).toEqual(2);
      done();
    });
});

test('errors: not found', done => {
  request(app)
    .get('/artists/0')
    .expect(404)
    .end(done);
});

test('errors: invalid params', done => {
  request(app)
    .post('/artists')
    .send({ id: 7, style: 'classical' })
    .expect(422)
    .end(done);
});
