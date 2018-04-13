import React from 'react';
import body from 'co-body';
import { Hold, Response } from '../../src';
import { db } from '../db';

const Create = env => (
  <Hold until={create(env)} onError={error}>
    {data => <Response json={data} />}
  </Hold>
);

// until operations can be promise chains
const create = env =>
  body.json(env.req).then(data =>
    db('artists')
      .insert(data)
      .then(ids =>
        db('artists')
          .where({ id: ids[0] })
          .first()
      )
  );

const error = (error, req, res) => {
  res.writeHead(422);
  res.end();
};

export default Create;
