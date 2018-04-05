import Knex from 'knex';

const db = Knex({
  client: 'sqlite3',
  useNullAsDefault: false,
  connection: {
    filename: './test/fixtures.sqlite',
  },
});

export const getArtists = () => db.select().from('artists');
