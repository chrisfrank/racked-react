const React = require('react');
const url = require('url');
const querystring = require('querystring');
const request = require('supertest');
const { Response, Hold, racked } = require('racked-react');

// an app that greets or updates the current user
const App = ({ request }) => (
  <Hold until={fakeAuthenticate(request)}>
    {currentUser => (
      <React.Fragment>
        {request.method === 'GET' && (
          <Response>
            <h1>Hello {currentUser.name}</h1>
          </Response>
        )}
        {request.method === 'PATCH' && (
          <Hold until={fakeUpdate(currentUser, request)}>
            {result => <Response>Updated! New name is {result.name}</Response>}
          </Hold>
        )}
      </React.Fragment>
    )}
  </Hold>
);

const fakeAuthenticate = req => {
  const token = req.headers['Authorization'];
  return Promise.resolve(
    fakeDatabase('users')
      .where({ token })
      .first()
  );
};

const fakeUpdate = (user, req) => {
  const qs = url.parse(req.url).query;
  const params = querystring.parse(qs);
  return Promise.resolve(
    fakeDatabase('users')
      .where({ id: user.id })
      .update({
        name: params.name,
      })
  );
};

const fakeDatabase = () => ({
  where: () => fakeDatabase(),
  update: ({ name }) => ({ name }),
  first: () => ({ name: 'James T. Kirk' }),
});

describe('a Kitchen sink example', () => {
  test('It says hi', done => {
    request(racked(App))
      .get('/')
      .then(res => {
        expect(res.text).toMatch('James T. Kirk');
        done();
      });
  });
  test('It updates a user', done => {
    request(racked(App))
      .patch('/?name=Spock')
      .then(res => {
        expect(res.text).toMatch('Spock');
        done();
      });
  });
});
