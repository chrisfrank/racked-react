import React from 'react';
import request from 'supertest';
import { Response, racked } from '../src/index';

const Layout = ({ children }) => (
  <Response headers={{ 'Content-Type': 'text/html' }}>
    <html>
      <head>
        <title>Hello from racked-react</title>
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
  request(racked(App))
    .get('/')
    .then(res => {
      expect(res.text).toMatch('HTML document');
      done();
    });
});
