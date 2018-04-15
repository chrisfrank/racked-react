# Racked React

Handle HTTP requests in React, with helper components for asynchronous I/O,
HTTP-method-based routing, and more.

## Why?

I love React's declarative, component-based approach to building user
interfaces. Turns out it's also a delightful way to handle HTTP requests.

There are already some great toolkits for building static sites in React -- most
notably [next.js][next] and [after.js][after].

Though you _can_ build static sites in racked-react, it's aimed more at full
CRUD apps, JSON APIs, and other I/O-heavy projects. Unlike Next and After,
racked-react lets you asynchronously read (and write!) data on the server,
without without statically declaring your routes in advance.

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

* [Installation](#installation)
* [Setup](#setup)
* [Hello, world](#hello-world)
* [Responses](#responses)
* [Routing](#routing)
  * [via Branch and Endpoint](routing-with-branch-and-endpoint)
  * [via react-router](#routing-with-react-router)
* [Async I/O](#async-io)
* [Use with Express, Koa, etc](#use-with-express-koa-etc)
* [Component API Reference](#component-api-reference)
* [Performance](#performance)

## Install

Via npm or yarn: `npm install --save racked-react` or `yarn add racked-react`

## Setup

You can use racked-react without JSX and babel, but I don't recommend it. Jared
Palmer's [Razzle][razzle] can help you configure a robust dev environment, or
you can use something like this `package.json` file, with babel for React stuff
and nodemon for reloading your dev server:

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

These docs assume you're using something like that package.json, with the
following directory structure:

`src` => your source code

`build` => your app's build folder

Here's what the `scripts` do:

`npm run start` starts your development server.

`npm run build` transpiles your `src` files via babel into your `dist` folder.

`npm run serve` serves your transpiled app.

## Hello, world.

Here's a complete "hello world" app in racked-react:

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

### Try it out:

1. In your project directory, write the code above to `src/index.js`.
2. Run `npm run start` to start your development server.
3. Visit http://localhost:3000 to see 'Hello, world' in your browser.

## Responses

A `<Response>` is the most important racked-react Component. You'll render a
`<Response>` each time your app handles a request.

As in Ruby's [Rack][rack], a `<Response>` in racked-react is made of an HTTP
status code, some key/value HTTP headers, and a body. Most of the time you won't
need to explicitly specify all those things, but here's how you would:

### Status, Headers, Body

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

// sending JSON explicitly
const JSONResponse = () => (
  <Response
    status={200}
    headers={{ 'Content-Type': 'application/json' }}
    body={JSON.stringify({ hello: 'world' })}
  />
);

// an HTTP 301 redirect
const Redirect = () => (
  <Response
    status={301}
    headers={{ Location: 'https://reactjs.org' }}
    body={null}
  />
);
```

### Implicit status/headers

A `<Response>` sets headers and status by default, so most of the time you won't
need to specify them:

```jsx
<Response body="<h1>Hello, world</h1>" />;
// returns an HTTP response with status 200 and some sensible default headers
```

### Implicit Body via React Children

If you're rendering a long HTML body, use react's implicit `children` prop
instead of a `body` prop:

```jsx
<Response>
  <h1>Hello, world.</h1>
  <p>You look nice today.</p>
</Response>;
```

### Rendering JSON via the `json` prop

Instead of setting Content-Type via `headers` and calling JSON.stringify on
`body`, you can use the `json` prop to return JSON-encoded data with the correct
Content-Type:

```jsx
cont data = [{ name: 'example' }, { name: 'another example' }];

<Response json={data} />
```

## Routing

Racked-react can handle Routing entirely on its own, via its `<Branch>` and
`<Endpoint>` components. But if you're already comfortable with [React
Router][router], you can use that instead, optionally composed with an
`<Endpoint>` when you need to restrict a route to just a particular HTTP-method,
like POST, GET, or DELETE.

### Routing with Branch and Endpoint

TODO

### Routing with React Router

TODO

## Async I/O

TODO

## Component API Reference

TODO

### Use with Express, Koa, etc

TODO

### Performance

TODO

[razzle]: https://github.com/jaredpalmer/razzle
[next]: https://github.com/zeit/next.js/
[after]: https://github.com/jaredpalmer/after.js/blob/master/README.md
[router]: https://reacttraining.com/react-router/
[rack]: https://github.com/rack/rack
