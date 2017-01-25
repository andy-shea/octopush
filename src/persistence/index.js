import config from 'config';

const db = require('knex')({
  client: 'pg',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    charset: 'utf8'
  },
  debug: config.db.debug
});

export default db;
