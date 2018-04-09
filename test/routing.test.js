import React from 'react';
import request from 'supertest';
import { findArtist } from './db';
import { Branch, Endpoint, Hold, Response, racked } from '../src/index';

const App = props => (
  <React.Fragment>
    <Endpoint method="GET" path="/">
      Home
    </Endpoint>
    <Branch path="/artists">
      <Branch path="/:id">
        {branch => (
          <Hold until={findArtist(branch.params.id)}>
            {artist => (
              <React.Fragment>
                <Endpoint method="GET">
                  <Response body={artist.name} />
                </Endpoint>
                <Endpoint method="PATCH" children={Update} />
                <Endpoint method="DELETE" children={Destroy} />
                <Endpoint path="/nest" method="GET" children={Nested} />
              </React.Fragment>
            )}
          </Hold>
        )}
      </Branch>
      {/* THIS NEEDS TO INHERIT ITS PARENT MATCH, NOT /artists/:id */}
      <Endpoint method="POST">
        <Create />
      </Endpoint>
      <Endpoint method="GET">
        <List />
      </Endpoint>
    </Branch>
    <Branch>
      <Response status={404} />
    </Branch>
  </React.Fragment>
);

const Create = () => <Response>Created artist</Response>;
const Read = () => <Response>Viewing artist</Response>;
const Update = () => <Response>Updated artist</Response>;
const Destroy = () => <Response>Destroyed artist</Response>;
const List = () => <Response>Listing artists</Response>;
const Nested = () => <Response>Nested under an artist</Response>;

const app = racked(App);

test('LIST', done => {
  request(app)
    .get('/artists')
    .then(res => {
      expect(res.text).toEqual('Listing artists');
      done();
    });
});

test('CREATE', done => {
  request(app)
    .post('/artists')
    .then(res => {
      expect(res.text).toEqual('Created artist');
      done();
    });
});

test.only('READ', done => {
  request(app)
    .get('/artists/3')
    .then(res => {
      expect(res.text).toEqual('James Blake');
      done();
    });
});

test('UPDATE', done => {
  request(app)
    .patch('/artists/3')
    .then(res => {
      expect(res.text).toEqual('Updated artist');
      done();
    });
});

test('DESTROY', done => {
  request(app)
    .delete('/artists/3')
    .then(res => {
      expect(res.text).toEqual('Destroyed artist');
      done();
    });
});

test('nested', done => {
  request(app)
    .get('/artists/3/nest')
    .then(res => {
      expect(res.text).toEqual('Nested under an artist');
      done();
    });
});

test('404', done => {
  request(app)
    .get('/does/not/exist')
    .expect(404)
    .end(done);
});
