import React from 'react';
import { db } from '../db';
import { Hold, Response } from '../../src';

const Read = env => (
  <Hold until={read(env)} onError={notFound}>
    {artist => <Response json={artist} />}
  </Hold>
);

// until operations can be fns that return promises
const read = env => () => {
  const id = env.branch.params.id;
  return db('artists')
    .where({ id })
    .first();
};

const notFound = (error, req, res) => {
  res.writeHead(404);
  res.end();
};

export default Read;
