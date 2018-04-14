# Racked React

Handle HTTP requests in React, with helper components for asynchronous I/O,
HTTP-method-based routing, and more.

## Why?

I love React's declarative, component-based approach to building user
interfaces. Turns out it's also a delightful way to handle HTTP requests.

```jsx
// an app that says hi
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
* [Responses](#response-api)
* [Routing](#routing)
* [Async I/O](#async-io)
* [Express, Koa, etc](#express-koa-etc)
* [API Reference](#api-reference)

## Install

Via npm or yarn:

`npm install --save racked-react`

or

`yarn add racked-react`

## Setup

You _can_ use racked-react without JSX and babel, but I don't recommend it.
Jared Palmer's [Razzle][razzle] can help you set up a robust dev environment, or
you can use something like this `package.json` file:

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
    "serve": "node build/index.js"
  },
  "license": "MIT"
}
```

These docs assume you're using something like that package.json, with the
following directory structure:

`src` => your source code `build` => your app's build folder

`npm run start` will start your development server.

`npm run build` will transpile your `src` files via babel into your `dist`
folder.

`npm run serve` will serve your transpiled app.

## Hello, world.

Here's a complete "hello world" app in racked-react:

```jsx
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

[razzle]: https://github.com/jaredpalmer/razzle
