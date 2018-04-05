import React from 'react';
import { Hold, Response } from '../src';
import { getArtists } from './data';
import Layout from './Layout';

const Artists = props => (
  <Hold until={getArtists} id="artists">
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

export default Artists;
