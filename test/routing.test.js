import React from 'react';
import request from 'supertest';
import { StaticRouter, Switch, Route } from 'react-router';
import { db, migrate, seed, rollback } from './db';
import { Endpoint, Hold, Response, racked } from '../src/index';

const query = id =>
  db('artists')
    .where({ id })
    .first();

const App = props => (
  <StaticRouter context={props} location={props.request.url}>
    <Switch>
      <Route
        path="/artists"
        render={r => (
          <Switch>
            <Route
              path={`${r.match.url}/:id`}
              render={r => (
                <Hold until={query(r.match.params.id)}>
                  {artist => (
                    <React.Fragment>
                      <Endpoint path={r.match.url} method="GET">
                        <Response body={artist.name} />
                      </Endpoint>
                      <Endpoint
                        path={`${r.match.url}/:artist_id`}
                        method="GET"
                        children={Nested}
                      />
                      <Endpoint
                        path={r.match.url}
                        method="PATCH"
                        children={Update}
                      />
                      <Endpoint
                        path={r.match.url}
                        method="DELETE"
                        children={Destroy}
                      />
                    </React.Fragment>
                  )}
                </Hold>
              )}
            />
            <Route
              render={() => (
                <React.Fragment>
                  <Endpoint path={r.match.url} method="POST">
                    <Create />
                  </Endpoint>
                  <Endpoint path={r.match.url} method="GET">
                    <List />
                  </Endpoint>
                </React.Fragment>
              )}
            />
          </Switch>
        )}
      />
      <Route exact path="/" render={() => <Response>Home</Response>} />
      <Route render={() => <Response status={404} />} />
    </Switch>
  </StaticRouter>
);

const Create = () => <Response status={201}>Created artist</Response>;
const Read = () => <Response>Viewing artist</Response>;
const Update = () => <Response>Updated artist</Response>;
const Destroy = () => <Response>Destroyed artist</Response>;
const List = () => <Response>Listing artists</Response>;
const Nested = env => <Response>Nested under an artist</Response>;

const app = racked(App);

beforeAll(migrate);
beforeAll(seed);
afterAll(rollback);

test('LIST', done => {
  request(app)
    .get('/artists')
    .expect(200, 'Listing artists')
    .end(done);
});

test('CREATE', done => {
  request(app)
    .post('/artists')
    .expect(201, 'Created artist')
    .end(done);
});

test('READ', done => {
  request(app)
    .get('/artists/3')
    .expect(200, 'James Blake')
    .end(done);
});

test('UPDATE', done => {
  request(app)
    .patch('/artists/3')
    .expect(200, 'Updated artist')
    .end(done);
});

test('DESTROY', done => {
  request(app)
    .delete('/artists/3')
    .expect(200, 'Destroyed artist')
    .end(done);
});

test('nested', done => {
  request(app)
    .get('/artists/3/nest')
    .expect(200, 'Nested under an artist')
    .end(done);
});

test('404', done => {
  request(app)
    .get('/does/not/exist')
    .expect(404)
    .end(done);
});

test('Root', done => {
  request(app)
    .get('/')
    .expect(200, 'Home')
    .end(done);
});
