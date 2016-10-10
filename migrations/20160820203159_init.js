exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('reset_password_token').unique();
      table.dateTime('reset_password_expires');
      table.timestamps();
    }),

    knex.schema.createTable('stacks', function(table) {
      table.increments('id').primary();
      table.string('title').unique().notNullable();
      table.string('slug').unique().notNullable();
      table.string('git_path').notNullable();
      table.string('diff');
      table.timestamps();
    }),

    knex.schema.createTable('groups', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('stack_id').unsigned().references('id').inTable('stacks').notNullable();
    }),

    knex.schema.createTable('servers', function(table) {
      table.increments('id').primary();
      table.string('hostname').unique().notNullable();
      table.timestamps();
    }),

    knex.schema.createTable('servers_stacks', function(table) {
      table.increments('id').primary();
      table.integer('stack_id').unsigned().references('id').inTable('stacks').notNullable();
      table.integer('server_id').unsigned().references('id').inTable('servers').notNullable();
    }),

    knex.schema.createTable('groups_servers', function(table) {
      table.increments('id').primary();
      table.integer('group_id').unsigned().references('id').inTable('groups').notNullable();
      table.integer('server_id').unsigned().references('id').inTable('servers').notNullable();
    }),

    knex.schema.createTable('deploys', function(table) {
      table.increments('id').primary();
      table.string('branch').notNullable();
      table.string('log_file').notNullable();
      table.json('hosts').notNullable(); // [{name, revisionFrom, revisionTo}]
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
      table.integer('stack_id').unsigned().references('id').inTable('stacks').notNullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('deploys'),
    knex.schema.dropTable('groups_servers'),
    knex.schema.dropTable('servers_stacks'),
    knex.schema.dropTable('servers'),
    knex.schema.dropTable('groups'),
    knex.schema.dropTable('stacks'),
    knex.schema.dropTable('users')
  ]);
};
