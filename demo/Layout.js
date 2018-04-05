import React from 'react';
import { Response } from '../src';

const Layout = ({ children }) => (
  <Response>
    <html>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body>
        <header>
          <h1>Example App</h1>
        </header>
        <main>{children}</main>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/artists">Artists</a>
            </li>
            <li>
              <a href="/redirect">Test a redirect</a>
            </li>
          </ul>
        </nav>
      </body>
    </html>
  </Response>
);

export default Layout;
