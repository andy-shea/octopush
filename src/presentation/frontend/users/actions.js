import {post} from '~/infrastructure/fetch';
import action from '../action';
import Stack from '~/domain/stack/Stack';
import Server from '~/domain/server/Server';
import User from '~/domain/user/User';
import {asyncActionCreator, async, createTypes} from 'redux-action-creator';
import {pathToAction} from 'redux-first-router';
import {types as routerTypes} from '../router/routes';

export const types = createTypes([...async('LOGIN')], 'USERS');

export const actions = {
  login: asyncActionCreator(types.LOGIN, 'username', 'password', {
    client: action(payload => post('/login', payload)),
    schema: {
      stacks: [Stack.normalizedSchema],
      servers: [Server.normalizedSchema],
      user: User.normalizedSchema
    }
  }),
  redirectAfterLogin: (path, routeMap) => {
    const routeAction = pathToAction(path, routeMap);
    if (routeAction.type === routerTypes.STACK && !routeAction.payload.stack) {
      routeAction.payload.stack = null;
    }
    return routeAction;
  }
};
