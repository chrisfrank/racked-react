import React from 'react';
import request from 'supertest';
const { Response, racked } = require('racked-react');

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
  <Layout>
    <h1>Hello from inside a full HTML document</h1>
  </Layout>
);

test('Layout renders children inside a full document', done => {
  request(racked(App).handler)
    .get('/')
    .then(res => {
      expect(res.text).toMatch('HTML document');
      expect(res.text).toMatch('DOCTYPE');
      done();
    });
});
