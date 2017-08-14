import {post} from '../utils/fetch';
import Stack from '~/domain/stack/Stack';
import Server from '~/domain/server/Server';
import User from '~/domain/user/User';
import {asyncActionCreator, async, createTypes} from 'redux-action-creator';
import {pathToAction} from 'redux-first-router';
import {types as routerTypes} from '../router/routes';

export const types = createTypes([...async('LOGIN')], 'USERS');

export const formName = 'users';

export const actions = {
  login: asyncActionCreator(types.LOGIN, {
    client: ({username, password}) => post('/login', {username, password}),
    schema: {
      stacks: [Stack.normalizedSchema],
      servers: [Server.normalizedSchema],
      user: User.normalizedSchema
    },
    formName
  }),
  redirectAfterLogin: (path, routeMap) => {
    const action = pathToAction(path, routeMap);
    if (action.type === routerTypes.STACK && !action.payload.stack) {
      action.payload.stack = null;
    }
    return action;
  }
};
