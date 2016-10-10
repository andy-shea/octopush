var config = require('config');

module.exports = {
  development: {
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
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: config.db.host,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: config.db.host,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  }
};
