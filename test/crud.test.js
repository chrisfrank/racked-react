import React from 'react';
import request from 'supertest';
import { db } from './db';
import { Branch, Endpoint, Hold, Response, racked } from '../src';

const Read = ({ branch }) => {
  const query = () =>
    db('artists')
      .where({ id: branch.params.id })
      .first();
  return <Hold until={query}>{artist => <Response json body={artist} />}</Hold>;
};

const App = () => (
  <Branch path="/artists">
    <Endpoint method="GET" children={Read} />
    <Endpoint method="POST" children={Read} />
    <Branch path="/:id">
      <Endpoint method="GET" children={Read} />
      <Endpoint method="PATCH" children={Read} />
      <Endpoint method="DELETE" children={Read} />
    </Branch>
  </Branch>
);

const app = racked(App);

test('READ', done => {
  request(app)
    .get('/artists/3')
    .then(res => {
      expect(res.body.name).toEqual('James Blake');
      done();
    });
});
