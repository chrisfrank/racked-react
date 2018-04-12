import React from 'react';
import body from 'co-body';
import { Hold, Response } from '../../src';
import { db } from '../db';

const read = id =>
  db('artists')
    .where({ id })
    .first();

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

// until operations can be promise cahins
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

const destroy = id =>
  db('artists')
    .where({ id })
    .del();

const list = () => db('artists');

export const Read = ({ branch }) => (
  <Hold until={read(branch.params.id)}>
    {artist => <Response json={artist} />}
  </Hold>
);

export const Update = env => (
  <Hold until={update(env)}>{data => <Response json={data} />}</Hold>
);

export const Create = env => (
  <Hold until={create(env)}>{data => <Response json={data} />}</Hold>
);

export const List = env => (
  <Hold until={list}>{artists => <Response json={artists} />}</Hold>
);

export const Delete = env => (
  <Hold until={destroy(env.branch.params.id)}>
    <Response status={204} />
  </Hold>
);