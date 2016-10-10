var config = require('config');

module.exports = {
  client: 'postgresql',
  connection: {
    host: config.db.host,
    database: config.db.name,
    user: config.db.user,
    password: config.db.password
  },
  migrations: {
    tableName: 'migrations'
  }
};
