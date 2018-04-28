// an app that lists songs on localhost:3000/
const React = require('react');
const request = require('supertest');
const { db, migrate, rollback, seed } = require('../test/db');
const { Response, Hold, racked } = require('racked-react');

const App = ({ request }) => (
  <Hold until={fetchSongs}>
    {songs => (
      <Response status={200} headers={{ 'X-Hello-From': 'racked-react' }}>
        <h1>Here are some songs:</h1>
        <ul>
          {songs.map(song => (
            <li key={song.id}>
              <a href={song.mp3_url}>{song.name}</a>
            </li>
          ))}
        </ul>
      </Response>
    )}
  </Hold>
);

const fetchSongs = () => db('artists');

beforeEach(migrate);
beforeEach(seed);
afterEach(rollback);

test('It says hi', done => {
  request(racked(App).handler)
    .get('/')
    .expect(200)
    .expect('X-Hello-From', 'racked-react')
    .end(done);
});
