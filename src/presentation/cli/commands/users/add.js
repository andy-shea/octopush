module.exports = (() => {
  'use strict'; // eslint-disable-line strict

  require('reflect-metadata');
  const Command = require('cmnd').Command;
  const prompt = require('prompt');
  const entityManager = require('../../../../domain/entityManager').default;
  const UserRepository = require('../../../../domain/user/UserRepository').default;
  const UserService = require('../../../../application/UserService').default;
  const session = entityManager.session();
  const service = new UserService(new UserRepository(session));

  class AddUserCommand extends Command {

    constructor() {
      super('users', 'add');
    }

    help() {
      return {
        description: 'Add a user',
        args: ['name', 'email']
      };
    }

    run(
        {
          args: [name, email]
        },
        callback
    ) {
      if (!name || !email) {
        return callback(Error('Name and email are required\noctopush users:add <name> <email>'));
      }
      prompt.start();
      prompt.message = '';
      prompt.delimiter = '';
      prompt.get(
        {properties: {password: {hidden: true, description: 'User password:'}}},
        (err, {password}) => {
          if (err) return callback(err);
          if (!password) return callback(Error('No password provided'));
          service
            .addUser(name, email, password)
            .then(session.flush.bind(session))
            .then(callback.bind(undefined, null, 'User added successfully'))
            .catch(callback);
        }
      );
    }

  }

  return AddUserCommand;
})();
