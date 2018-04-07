import React, { Fragment } from 'react';
import request from 'supertest';
import { Response, Match as Branch, racked } from '../src/index';

const App = props => (
  <Branch>
    <Branch path="/artists">
      <Branch path="/:id">
        <Branch method="GET" exact children={Read} />
        <Branch method="PATCH" children={Update} />
        <Branch method="DELETE" children={Destroy} />
      </Branch>
      <Branch method="POST" exact>
        <Create />
      </Branch>
      <Branch method="GET" exact>
        {List}
      </Branch>
    </Branch>
  </Branch>
);

const Create = () => <Response>Created artist</Response>;
const Read = () => <Response>Viewing artist</Response>;
const Update = () => <Response>Updated artist</Response>;
const Destroy = () => <Response>Destroyed artist</Response>;
const List = () => <Response>Listing artists</Response>;
const Nested = () => <Response>Nested under an artist</Response>;

const app = racked(App);

test(
  'LIST',
  done => {
    request(app)
      .get('/artists')
      .then(res => {
        expect(res.text).toEqual('Listing artists');
        done();
      });
  },
  100
);

test(
  'CREATE',
  done => {
    request(app)
      .post('/artists')
      .then(res => {
        expect(res.text).toEqual('Created artist');
        done();
      });
  },
  100
);

test(
  'READ',
  done => {
    request(app)
      .get('/artists/3')
      .then(res => {
        expect(res.text).toEqual('Viewing artist');
        done();
      });
  },
  100
);

test(
  'UPDATE',
  done => {
    request(app)
      .patch('/artists/3')
      .then(res => {
        expect(res.text).toEqual('Updated artist');
        done();
      });
  },
  100
);

test(
  'DESTROY',
  done => {
    request(app)
      .delete('/artists/3')
      .then(res => {
        expect(res.text).toEqual('Destroyed artist');
        done();
      });
  },
  100
);

test(
  'nested',
  done => {
    request(app)
      .get('/artists/3/nested')
      .then(res => {
        expect(res.text).toEqual('Nested under an artist');
        done();
      });
  },
  100
);
