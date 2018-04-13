import React from 'react';
import { db } from '../db';
import url from 'url';
import querystring from 'querystring';
import { Hold, Response } from '../../src';

const list = env => {
  const query = db('artists');
  const qs = url.parse(env.req.url).query;
  const params = querystring.parse(qs);
  const { genre } = params;
  return genre ? query.where({ genre }) : query;
};

export const List = env => (
  <Hold until={list(env)}>{artists => <Response json={artists} />}</Hold>
);

export default List;
