import {arrayOf} from 'normalizr';
import {post} from 'ftchr';
import Stack from '~/domain/stack/Stack';
import Server from '~/domain/server/Server';
import User from '~/domain/user/User';
import {asyncActionCreator, async, createTypes} from 'redux-action-creator';

export const types = createTypes([...async('LOGIN')], 'USERS');

export const actions = {
  login: asyncActionCreator(types.LOGIN, {
    client: ({username, password}) => post('/login', {username, password}),
    schema: {
      stacks: arrayOf(Stack.normalizedSchema),
      servers: arrayOf(Server.normalizedSchema),
      user: User.normalizedSchema
    }
  })
};
