const Knex = require('knex');

const db = Knex({
  client: 'sqlite3',
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
  findArtist,
};
