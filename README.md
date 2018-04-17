# Racked React

Handle HTTP requests in React, with asynchronous I/O

## Why?

I love React's declarative, component-based approach to building user
interfaces. Turns out it's also a delightful way to handle HTTP requests.

```jsx
// an app that says hi
const { Response } = require('racked-react');

const App = ({ request }) => (
  <Response status={200} headers={{ 'X-Hello-From': 'racked-react' }}>
    <h1>Hello at {request.url}</h1>
  </Response>
);
```

## Contents

* [Why not?](#why-not)
* [Installation](#installation)
* [Setup](#setup)
* [A "Hello, world" Example](#a-hello-world-example)
* [A More Interesting Example](#a-more-interesting-example)
* [Component API]
  * [The `<Response>` Component](#the-response-component)
  * [Async I/O with the `<Hold>` Component](#async-io-with-the-hold-component)
  * [Routing](#routing)
    * [via react-router](#routing-with-react-router)
    * [via Branch and Endpoint](routing-with-branch-and-endpoint)
* [Use with Express](#use-with-express)
* [Performance](#performance)

## Why not?

If your app delivers static HTML and doesn't need to write data, you'll probably
be happier with [next.js][next] or [after.js][after] than with racked-react.

Though you _can_ build static sites in racked-react, it's aimed at building JSON
APIs, traditional CRUD apps, or other I/O-heavy projects. Unlike Next and After,
racked-react lets you asynchronously read and write data on the server, without
statically declaring your routes in advance.

## Installation

Via npm or yarn:

`npm install --save racked-react`

or

`yarn add racked-react`

## Setup

### JSX/Babel

These docs assume you'll be using JSX via Babel. Like React itself, racked-react
works fine without JSX, but JSX makes the work more pleasant.

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

For more advanced setups, I recommend Jared Palmer's [Razzle][razzle] library.

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
const http = require('http');
const React = require('react');
const { racked, Response } = require('racked-react');

const App = () => (
  <Response>
    <h1>Hello, world.</h1>
  </Response>
);

const server = http.createServer(racked(App));

server.listen(3000);
```

### What's happening:

Calling `racked(App)` connects Node’s [http server][node-http] to your app, with
node's `request` and `response` objects attached (a) as top-level props, and (b)
to a [React Context][context].

When your App renders, it can use racked-react's utility components to consume
or modify the context, until it eventually renders a `<Response>`.

## A More Interesting Example

This example uses a few of racked-react's utility components: `<Hold>` for async
I/O, `<Endpoint>` for HTTP-method-based routing, and `<Response>` for writing
finished responses.

`GET => /` returns the current user's name

`PATCH => /` updates the current user.

Calls to the database are fake, but should look familiar if you've ever used
[knex.js][knex].

```jsx
// src/index.js
const http = require('http');
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

const server = http.createServer(racked(App));

server.listen(3000);
```

## Component API Reference

### The `<Response>` Component

A `<Response>` is the most important component in the library. You'll render one
`<Response>` each time your app handles a request.

#### `<Response>` Prop Types

| Property | Type       | Default                            | Description                                                                                                                                |
| :------- | :--------- | :--------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| status   | Number     | `200`                              | An HTTP status code                                                                                                                        |
| headers  | Object     | `{ 'Content-Type': 'text/plain' }` | If the client specifies an 'Accept' header, <Response> will use that content-type instead of the text/plain default.                       |
| body     | String     | `''`                               |                                                                                                                                            |
| children | React elem |                                    | Using `children` will override `body` -- useful for rendering long JSX bodies                                                              |
| json     | any        |                                    | Use `json` will override `body` to automatically call JSON.stringify(json) and set the request 'Content-Type' header to 'application/json' |

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

`<Hold>` component accepts a promise as a prop, suspends rendering until the
promise resolves, then renders its children with the resolved promise.

```jsx
// use a render prop when you need the result of the promise
const HoldWithRenderProp = () => (
  <Hold until={fetchUsers()}>{users => <Response json={users} />}</Hold>
);

// a fake user-fetching function
const fetchUsers = () => fakeDatabase.select('*').from('users');

// use regular JSX children when you need to perform an async operation,
// but don't need to render the result
const HoldWithRenderProp = () => (
  <Hold until={deleteEverything()}>
    <Response body="Deleted everything!" />
  </Hold>
);
```

#### `<Hold>` Prop Types

| Property | Type                 | Default                 | Description                                                                                                           |
| :------- | :------------------- | :---------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| until    | Function, Promise    |                         | Accepts either a promise, e.g `knex('users')`, or a function that returns a promise, e.g. `() => knex('users')`.      |
| onError  | Function             | sends an HTTP-500 error | A function of the form `(error, request, response) => {}`                                                             |
| children | Function, React elem |                         | When you need to render the result `until`, use a function as `children`. Otherwise, you can just use React elements. |

### Routing

Racked-react can handle Routing on its own, via its `<Branch>` and `<Endpoint>`
components. But if you're already comfortable with [React Router][router], you
can just use that!

#### Routing with React Router

TODO

#### Routing with `<Branch>` and `<Endpoint>`

TODO

## Use with Express, Koa, etc

TODO

## Performance

TODO

## Contributing

[razzle]: https://github.com/jaredpalmer/razzle
[next]: https://github.com/zeit/next.js/
[after]: https://github.com/jaredpalmer/after.js/blob/master/README.md
[router]: https://reacttraining.com/react-router/
[rack]: https://github.com/rack/rack
[node-server]: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
[context]: https://reactjs.org/docs/context.html
[knex]: http://knexjs.org
