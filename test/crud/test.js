import React from 'react';
import request from 'supertest';
import { Branch, Endpoint, racked } from '../../src';
import { Create, Read, Update, Delete, List } from './actions';
import { migrate, rollback, seed } from '../db';

const App = () => (
  <Branch path="/artists">
    <Endpoint method="GET" children={List} />
    <Endpoint method="POST" children={Create} />
    <Branch path="/:id">
      <Endpoint method="GET" children={Read} />
      <Endpoint method="PATCH" children={Update} />
      <Endpoint method="DELETE" children={Delete} />
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

test('LIST', done => {
  request(app)
    .get('/artists')
    .then(res => {
      expect(res.body.length).toEqual(5);
      done();
    });
});

test('errors: not found', done => {
  request(app)
    .get('/artists/0')
    .expect(404)
    .end(done);
});
