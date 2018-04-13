import React from 'react';
import body from 'co-body';
import { Hold, Response } from '../../src';
import { db } from '../db';

const Update = env => (
  <Hold until={update(env)}>{data => <Response json={data} />}</Hold>
);

// until operations can be async fns
const update = async env => {
  const { id } = env.branch.params;
  const data = await body.json(env.req);
  await db('artists')
    .where({ id })
    .update(data);
  return db('artists')
    .where({ id })
    .first();
};

const error = (error, req, res) => {
  res.writeHead(422);
  res.end();
};

export default Update;
