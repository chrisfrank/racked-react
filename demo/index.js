import React from 'react';
import { StaticRouter, Route, Switch } from 'react-router';
import { Redirect, Response, racked } from '../src';
import Artists from './Artists';
import Home from './Home';

const App = props => (
  <StaticRouter location={props.req.url} context={props}>
    <Switch>
      <Route path="/artists" component={Artists} />
      <Route path="/redirect" render={() => <Redirect to="/artists" />} />
      <Route exact path="/" component={Home} />
      <Route render={() => <Response status={404} />} />
    </Switch>
  </StaticRouter>
);

racked(App).listen(3000, '127.0.0.1');
