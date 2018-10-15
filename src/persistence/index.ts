import config from 'config';
import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.name'),
    charset: 'utf8'
  },
  debug: config.get('db.debug')
});

export default db;
