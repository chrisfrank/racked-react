const express = require('express');
const React = require('react');
const request = require('supertest');
const { racked, Branch, Endpoint, Response } = require('../dist');

const data = [{ id: 1, name: '1' }, { id: 2, name: '2' }];

const App = () =>
  React.createElement(
    Branch,
    { path: '/artists' },
    React.createElement(
      Endpoint,
      { method: 'GET' },
      React.createElement(Response, { json: true, body: data })
    )
  );
const rackTest = racked(App).listen(3000, '127.0.0.1');

const expressTest = express();
expressTest.get('/artists', (req, res) => {
  res.json(data);
});
expressTest.listen(3001);
