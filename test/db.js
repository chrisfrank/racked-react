const db = require('knex')({
  client: 'sqlite3',
  useNullAsDefault: false,
  connection: {
    filename: ':memory:',
  },
});

const ARTISTS = [
  { name: 'Blake Mills', genre: 'alternative' },
  { name: 'Björk', genre: 'electronic' },
  { name: 'James Blake', genre: 'electronic' },
  { name: 'Janelle Monae', genre: 'alt-soul' },
  { name: 'SZA', genre: 'alt-soul' },
];

const migrate = () =>
  db.schema.createTable('artists', table => {
    table.increments();
    table.string('name');
    table.string('genre');
    table.timestamps();
  });

const rollback = () => db.schema.dropTable('artists');

const seed = () => db('artists').insert(ARTISTS);

module.exports = {
  db,
  seed,
  migrate,
  rollback,
  findArtist() {},
};
