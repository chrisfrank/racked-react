import React from 'react';
import { Hold, Response } from '../../src';
import { db } from '../db';

const destroy = id =>
  db('artists')
    .where({ id })
    .del();

const Destroy = env => (
  <Hold until={destroy(env.branch.params.id)}>
    <Response status={204} />
  </Hold>
);

export default Destroy;
