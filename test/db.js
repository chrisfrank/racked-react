const Knex = require('knex');

const db = Knex({
  client: 'sqlite3',
  useNullAsDefault: false,
  connection: {
    filename: './test/fixtures.sqlite',
  },
});

const findArtist = id => () =>
  db('artists')
    .where({ id: +id })
    .first();

module.exports = {
  default: db,
  db,
  findArtist,
};
