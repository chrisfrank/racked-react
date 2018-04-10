import React from 'react';
import { Hold, Response } from '../../src';
import { db } from '../db';

export const Read = ({ branch }) => (
  <Hold
    until={db('artists')
      .where({ id: branch.params.id })
      .first()}
  >
    {artist => <Response json={artist} />}
  </Hold>
);

export const Create = () => null;
export const List = () => null;
export const Update = () => null;
export const Delete = () => null;
