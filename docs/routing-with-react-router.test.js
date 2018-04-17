import React from 'react';
import request from 'supertest';
import { StaticRouter, Switch, Route } from 'react-router';
import { db, migrate, seed, rollback } from '../test/db';
import { Hold, Response, racked } from '../src/index';

// Routing with react router
// <StaticRouter> requires a `context` object -- we'll use it to make
// racked-react's env available in our routes as props.staticContext
const App = env => (
  <StaticRouter context={env} location={env.request.url}>
    <Switch>
      <Route path="/artists" component={Artists} />
      <Route exact path="/" render={() => <Response>Home</Response>} />
      <Route render={() => <Response status={404} />} />
    </Switch>
  </StaticRouter>
);

// The Artists component gets rendered by a <Route />, so accepts all the
// standard Route props -- match, staticContext, etc
const Artists = ({ match, staticContext }) => {
  const { request } = staticContext;
  return (
    <Switch>
      <Route
        exact
        path={match.url}
        component={request.method === 'POST' ? Create : List}
      />
      <Route
        path={`${match.url}/:id`}
        render={r => (
          <Hold until={findArtist(r.match.params.id)}>
            {artist => (
              <Switch>
                {request.method === 'PATCH' && <Route component={Update} />}
                {request.method === 'DELETE' && <Route component={Destroy} />}
                <Route render={() => <Read artist={artist} />} />
              </Switch>
            )}
          </Hold>
        )}
      />
    </Switch>
  );
};

const findArtist = id =>
  db('artists')
    .where({ id })
    .first();

const Create = () => <Response status={201}>Created artist</Response>;
const Read = ({ artist }) => <Response>{artist.name}</Response>;
const Update = () => <Response>Updated artist</Response>;
const Destroy = () => <Response>Destroyed artist</Response>;
const List = () => <Response>Listing artists</Response>;

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
