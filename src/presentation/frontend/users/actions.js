import {post} from '../utils/fetch';
import Stack from '~/domain/stack/Stack';
import Server from '~/domain/server/Server';
import User from '~/domain/user/User';
import {asyncActionCreator, async, createTypes} from 'redux-action-creator';
import {pathToAction} from 'redux-first-router';
import {types as routerTypes} from '../router/routes';

export const types = createTypes([...async('LOGIN')], 'USERS');

export const actions = {
  login: asyncActionCreator(types.LOGIN, 'username', 'password', {
    client: async (payload, {setErrors}) => {
      try {
        return await post('/login', payload);
      }
      catch (error) {
        setErrors(error.response.data);
      }
    },
    schema: {
      stacks: [Stack.normalizedSchema],
      servers: [Server.normalizedSchema],
      user: User.normalizedSchema
    }
  }),
  redirectAfterLogin: (path, routeMap) => {
    const action = pathToAction(path, routeMap);
    if (action.type === routerTypes.STACK && !action.payload.stack) {
      action.payload.stack = null;
    }
    return action;
  }
};
