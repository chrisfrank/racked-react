import React from 'react';
import request from 'supertest';
import { Branch, Endpoint, racked } from '../../src';
import { Create, Read, Update, Delete, List } from './read';
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

test('READ', done => {
  request(app)
    .get('/artists/3')
    .then(res => {
      expect(res.body.name).toEqual('James Blake');
      done();
    });
});
