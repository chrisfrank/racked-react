import React from 'react';
import { Hold, Response, EnvConsumer } from '../../src';
import body from 'co-body';
import url from 'url';
import querystring from 'querystring';
import { db } from '../db';

// create a new artist
export const Create = env => {
  const promise = body.json(env.request).then(data =>
    db('artists')
      .insert(data)
      .then(ids =>
        db('artists')
          .where({ id: ids[0] })
          .first()
      )
      .catch(err => {
        env.response.writeHead(422);
        env.response.end();
      })
  );
  return (
    <Hold until={promise}>{data => <Response json={data} status={201} />}</Hold>
  );
};

// show an artist
export const Read = env => {
  const id = env.branch.params.id;
  const promise = db('artists')
    .where({ id })
    .first();
  const onError = (err, req, res) => {
    res.writeHead(404);
    res.end();
  };
  return (
    <Hold until={promise} onError={onError}>
      {data => <Response json={data} />}
    </Hold>
  );
};

// update an artist
export const Update = () => (
  <EnvConsumer>
    {env => {
      const promise = async () => {
        const { id } = env.branch.params;
        const data = await body.json(env.request);
        await db('artists')
          .where({ id })
          .update(data);
        return db('artists')
          .where({ id })
          .first();
      };
      return <Hold until={promise}>{data => <Response json={data} />}</Hold>;
    }}
  </EnvConsumer>
);

// delete an artist
export const Destroy = env => {
  const { id } = env.branch.params;
  const promise = db('artists')
    .where({ id })
    .del();
  return (
    <Hold until={promise}>
      <Response status={204} />
    </Hold>
  );
};

// list artists, optionally filtered by genre
export const List = () => (
  <EnvConsumer>
    {env => {
      const query = db('artists');
      const qs = url.parse(env.request.url).query;
      const params = querystring.parse(qs);
      const { genre } = params;
      const promise = genre ? query.where({ genre }) : query;
      return <Hold until={promise}>{data => <Response json={data} />}</Hold>;
    }}
  </EnvConsumer>
);
