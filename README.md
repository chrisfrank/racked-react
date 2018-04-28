# Racked React

Handle HTTP requests in React

## Why?

I love React's declarative, component-based approach to building user
interfaces. Turns out it's also a delightful way to handle HTTP requests.

```jsx
// an app that lists songs on localhost:3000/

// boilerplate
const React = require('react');
const db = require('your-favorite-database-library');

// components from racked-react:
// <Hold> for async I/O
// <Response> for writing HTTP responses
// `racked` for connecting your App to http.createServer, express, or whatever
const { Response, Hold, racked } = require('racked-react');

const App = ({ request }) => (
  <Hold until={fetchSongs}>
    {songs => (
      <Response status={200} headers={{ 'X-Hello-From': 'racked-react' }}>
        <h1>A list of songs:</h1>
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

const fetchSongs = () => db.select('*').from('songs);

racked(App).listen(3000);
```

## Contents

* [Why not?](#why-not)
* [Installation](#installation)
* [Setup](#setup)
* [A "Hello, world" Example](#a-hello-world-example)
* [A More Interesting Example](#a-more-interesting-example)
* [Component API Reference](#component-api-reference)
  * [The `<Response>` Component](#the-response-component)
  * [Async I/O with the `<Hold>` Component](#async-io-with-the-hold-component)
  * [Routing](#routing)
    * [via react-router](#routing-with-react-router)
    * [via `<Branch>` and `<Endpoint>`](routing-with-branch-and-endpoint)
  * [The `racked` function](#the-racked-function)
* [Use with Express](#use-with-express)

## Why not?

If your app delivers static HTML and doesn't need to write data, you'll probably
be happier with [next.js][next] or [after.js][after] than with racked-react.

Though you _can_ build static sites in racked-react, it's aimed at building REST
APIs, traditional CRUD apps, and other I/O-heavy projects. Its main advantage
over Next and After is that it lets you asynchronously read and write data on
the server, without statically declaring your routes in advance.

## Installation

Via npm or yarn:

`npm install --save racked-react`

or

`yarn add racked-react`

## Setup

Skip to the [next section](#setup) if you already have a server-side JSX/Babel
setup that works for you.

### JSX/Babel

These docs assume you'll be using JSX via Babel. Like React itself, racked-react
works fine without JSX, but JSX can make your work more pleasant.

The sample `package.json` file below should get you started with Babel/JSX,
`nodemon` for running a dev server, and a few helper scripts:

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "main": "build/index.js",
  "dependencies": {
    "racked-react": "^0.1"
  },
  "devDependencies": {
    "babel-cli": "^6",
    "babel-core": "^6",
    "babel-preset-env": "^1",
    "babel-preset-react": "^6",
    "nodemon": "^1"
  },
  "scripts": {
    "build": "babel src -d build",
    "start": "nodemon src/index.js --exec babel-node",
    "serve": "NODE_ENV=production node build/index.js"
  },
  "license": "MIT"
}
```

### Scripts &amp; Directory Structure

Assuming you're using something like the sample package.json above, your app's
directory structure might look like this:

`src/` => your JSX source code

`build/` => your app's transpiled build, for running in production

In that context, here's what the `scripts` do:

`npm run start` serves your `src` files in development mode.

`npm run build` transpiles your `src` files via babel into your `build` folder.

`npm run serve` serves your transpiled app in production mode.

## Hello, world.

Let's see an app that listens on localhost:3000, and says hello:

```jsx
// src/index.js
const React = require('react');
const { racked, Response } = require('racked-react');

const App = ({ request, response }) => (
  <Response>
    <h1>Hello, world.</h1>
    <p>This request was made at {request.url}.</p>
  </Response>
);

racked(App).listen(3000);
```

### What's happening:

Calling `racked(App)` connects Node’s [http server][node-http] to your app, with
node's `request` and `response` objects attached (a) as top-level props, and (b)
to a [React Context][context].

When your App renders, it can use racked-react's utility components to consume
or modify the context, until it eventually renders a `<Response>`.

## A More Interesting Example

This example uses racked-react's `<Hold>` for async I/O, and `<Response>` for
writing finished responses.

`GET => /` returns the current user's name

`PATCH => /` updates the current user.

Calls to the database are fake, but should look familiar if you've ever used
[knex.js][knex].

```jsx
// src/index.js
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
  return fakeDatabase('users')
    .where({ token })
    .first();
};

const fakeUpdate = (user, req) => {
  const { query } = url.parse(req.url);
  const params = querystring.parse(query);
  return fakeDatabase('users')
    .where({ id: user.id })
    .update({
      name: params.name,
    });
};

racked(App).listen(3000);
```

## Component API Reference

### The `<Response>` Component

A `<Response>` is the most important component in the library. You'll render one
`<Response>` each time your app handles a request.

#### `<Response>` Prop Types

| Property | Type       | Default | Description                                                                                                                                                       |
| :------- | :--------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| status   | Number     | `200`   | An HTTP status code                                                                                                                                               |
| headers  | Object     | `{}`    | If the client specifies an 'Accept' header, `<Response>` will respect it.                                                                                         |
| body     | String     | `''`    |                                                                                                                                                                   |
| children | React elem |         | Using `children` will override `body` -- useful for rendering long JSX bodies                                                                                     |
| json     | any        |         | Use `json` will override `body` to automatically call JSON.stringify(json) and set the request 'Content-Type' header to 'application/json'                        |
| prefix   | String     |         | Optionally prepend a string to your response -- useful for rendering `<!DOCTYPE html>` or other things JSX doesn't support                                        |
| suffix   | String     |         | Optionally append a string to your response. Useful for nothing I can think of, but the asymmetry of supporting `prefix` without `suffix` would have bothered me. |

#### Status, Headers, Body

As in Ruby's [Rack][rack], a `<Response>` in racked-react is made of an HTTP
status code, some key/value HTTP headers, and a body.

```jsx
const { Response } = require('racked-react');

// sending HTML
const HTMLResponse = () => (
  <Response
    status={200}
    headers={{ 'Content-Type': 'text/html' }}
    body="<h1>Hello, world</h1>"
  />
);
```

#### Implicit status/headers

A `<Response>` sets headers and status by default, so most of the time you won't
need to specify them:

```jsx
// returns an HTTP 200 response with default headers
const Hello = () => <Response body="<h1>Hello, world</h1>" />;
```

#### For HTML: use JSX children instead of `body`

If you're rendering a long HTML body, use JSX children instead of a `body` prop:

```jsx
const LongHello = () => (
  <Response>
    <h1>Hello, world.</h1>
    <p>You look nice today.</p>
  </Response>
);
```

#### For sending full HTML pages, make a `<Layout>` component

If your app responds with full HTML pages, you'll probably want to make a
reusable `<Layout>` component. In this example, `<Layout>` accepts a `title`
prop for setting the page title, and a`children`prop for rendering the contents
of the page `<body>`.

This example also uses the `<Response>` component's `prefix` prop to prepend a
valid HTML5 Doctype to the response. JSX doesn't support rendering <!DOCTYPE> on
its own.

```jsx
const Layout = ({ children, title }) => (
  <Response prefix="<!DOCTYPE html>" headers={{ 'Content-Type': 'text/html' }}>
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  </Response>
);

const App = () => (
  <Layout title="Hello, World">
    <h1>Hello from inside a full HTML document</h1>
  </Layout>
);
```

#### For JSON: use the `json` prop instead of `body`

Instead of setting Content-Type via `headers` and calling `JSON.stringify` on
`body`, you can use the `json` prop to return JSON-encoded data with the correct
Content-Type:

```jsx
cont data = [{ name: 'example' }, { name: 'another example' }];
const JSONResponse = () => <Response json={data} />;
```

### Async I/O with the `<Hold>` Component

Use a `<Hold>` component when you need to asynchronously read or write data.

The `<Hold>` component accepts a promise as a prop, suspends rendering until the
promise resolves, then renders its children with the resolved promise.

```jsx
// use a render prop when you need the result of the promise
const HoldWithRenderProp = () => (
  <Hold until={fetchUsers()}>{users => <Response json={users} />}</Hold>
);

// use regular JSX children when you need to perform an async operation,
// but don't need to render the result
const HoldWithRenderProp = () => (
  <Hold until={deleteEverything()}>
    <Response status={204} body="Deleted everything!" />
  </Hold>
);

// a fake user-fetching function
const fetchUsers = () => fakeDatabase.select('*').from('users');
// a fake delete-everything function
const deleteEverything = () => fakeDatabase('users').truncate();
```

#### `<Hold>` Prop Types

| Property | Type                 | Default                 | Description                                                                                                           |
| :------- | :------------------- | :---------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| until    | Function, Promise    |                         | Accepts either a promise, e.g `knex('users')`, or a function that returns a promise, e.g. `() => knex('users')`.      |
| onError  | Function             | sends an HTTP-500 error | A function of the form `(error, request, response) => {}`                                                             |
| children | Function, React elem |                         | When you need to render the result `until`, use a function as `children`. Otherwise, you can just use React elements. |

#### Composing `<Hold>` with `<Response>`

Render `<Hold>`s outside of `<Response>`. A `<Hold>` _inside_ a `<Response>`
does nothing.

```jsx
// GOOD
<Hold until={somethingHappens}>
  {result => <Response json={result} />}
</Hold>

// Bad
<Response>
  <Hold until={somethingHappens}>{result => '???'}</Hold>
</Response>
```

### Routing

Racked-react can handle Routing on its own, via its `<Branch>` and `<Endpoint>`
components. But if you're already comfortable with [React Router][router], you
can just use that!

#### Routing with React Router

React Router provides a `<StaticRouter>` for use on the server, but doing I/O
usually requires staticlly configuring your routes beforehand, as in [this
gist][static_routes]. So doing I/O means losing some of the advantanges of
dynamic routing.

With racked-react, you can use the `<Hold>` component with `<StaticRouter>` to
handle routing &amp; I/O dynamically:

```jsx
import React from 'react';
import { StaticRouter, Switch, Route } from 'react-router';
import { Hold, Response, racked } from '../src/index';

// Routing with react router
// <StaticRouter> requires a `context` object -- we'll use it to make
// racked-react's props available to our Routes as props.staticContext
//
// Here's an app that handles Create, Read, Update, Destroy at `/artists`,
// renders a home page at `/`, and 404s at any other route
const App = props => (
  <StaticRouter context={props} location={props.request.url}>
    <Switch>
      <Route path="/artists" component={Artists} />
      <Route exact path="/" render={() => <Response>Home</Response>} />
      <Route render={() => <Response status={404} />} />
    </Switch>
  </StaticRouter>
);

// The Artists component gets rendered by a <Route />, so accepts all the
// standard route props -- match, staticContext, etc
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
                <Route render={() => <Response body={artist.name} />} />
              </Switch>
            )}
          </Hold>
        )}
      />
    </Switch>
  );
};
// the components that power each route are, for brevity, omitted from this
// example. see docs/routing-with-react-router.test.js for the full code.
```

#### Routing with `<Branch>` and `<Endpoint>`

Documentation forthcoming, see [test/crud/test.js][test] for now.

### The `racked` function

Calling `racked(App)` returns an object with two keys: `listen`, and `handler`:

```js
// calling racked(App) returns =>
{
 // `handler` renders your app with ({ request, response }) as top-level props
  handler: (req, res) => <App request={req} response={res} />,
 // `listen` creates an http.Server and delgates to its `listen` function
  listen: () => http.createServer(handler).listen(arguments)
}
```

If you're using racked-react on its own, you'll probably ignore the `handler`
and just call listen:

```js
const app = racked(App);
app.listen(3000);
```

If you're using racked-react with express.js, you'll use the `handler` to mount
your `racked(App).handler` as middleware. See below for details.

## Use with Express

For apps that do anything useful, you may want access to URL params, a parsed
request body, etc. Using [express.js][express] and some middleware can handle
that for you:

```jsx
import React from 'react';
import express from 'express';
import bodyParser from 'body-parser';
import { Response, racked } from 'racked-react';

// an App that echoes back a request's JSON body
const App = ({ request }) => <Response json={request.body} />;

// instantiate express
const server = express();

// mount middleware for parsing JSON request bodies
server.use(bodyParser.json());

// mount our racked(App) as the final middleware
server.use(racked(App).handler);

// start the server
server.listen(process.env.PORT || 3000);
```

## Contributing

For bugs, please open
[an issue](https://github.com/chrisfrank/racked-react/issues) on Github.

Pull requests for new features are welcome!

## License

### MIT

Copyright 2018 Chris Frank

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[razzle]: https://github.com/jaredpalmer/razzle
[next]: https://github.com/zeit/next.js/
[after]: https://github.com/jaredpalmer/after.js/blob/master/README.md
[router]: https://reacttraining.com/react-router/
[rack]: https://github.com/rack/rack
[node-http]: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
[context]: https://reactjs.org/docs/context.html
[knex]: http://knexjs.org/
[express]: http://expressjs.com/
[static_routes]: https://gist.github.com/ryanflorence/efbe562332d4f1cc9331202669763741
[test]: https://github.com/chrisfrank/racked-react/blob/master/test/crud/test.js
