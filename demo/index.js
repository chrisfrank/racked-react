import React from 'react';
import { Redirect, Response, Route, racked } from '../src';
import Artists from './Artists';
import Home from './Home';

const App = props => (
  <div>
    <Route path="/artists" children={Artists} />
    <Route path="/redirect" children={() => <Redirect to="/artists" />} />
    <Route path="/" children={Home} />
    <Route children={() => <Response status={404} />} />
  </div>
);

racked(App).listen(3000, '127.0.0.1');
