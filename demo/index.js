import React from 'react';
import Knex from 'knex';
import { StaticRouter, Route, Switch } from 'react-router';
import { Hold, Response, racked } from '../src';

const db = Knex({
  client: 'sqlite3',
  useNullAsDefault: false,
  connection: {
    filename: './test/fixtures.sqlite',
  },
});

const query = () => db.select().from('artists');

const Artists = () => (
  <Hold until={query} id="artists">
    {data => (
      <Layout>
        <ul>
          {data.map(artist => (
            <li>
              <h1>{artist.name}</h1>
              <p>{artist.genre}</p>
            </li>
          ))}
        </ul>
      </Layout>
    )}
  </Hold>
);

const Static = () => (
  <Layout>
    <h1>Hi!</h1>
    <p>
      <a href="/artists">View artists</a>
    </p>
  </Layout>
);

const App = props => (
  <StaticRouter location={props.req.url} context={props}>
    <Switch>
      <Route path="/artists" component={Artists} />
      <Route path="/static" component={Static} />
      <Route component={Static} />
    </Switch>
  </StaticRouter>
);

const Layout = ({ children }) => (
  <Response headers={{ 'Content-Type': 'text/html' }}>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>{children}</body>
    </html>
  </Response>
);

racked(App).listen(3000, '127.0.0.1');
