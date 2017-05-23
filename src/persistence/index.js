import config from 'config';
import knex from 'knex';

const db = knex({
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
