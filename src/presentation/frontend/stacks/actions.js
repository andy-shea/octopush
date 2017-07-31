import {get, post, del} from '../utils/fetch';
import Stack from '~/domain/stack/Stack';
import {actionCreator, asyncActionCreator, async, createTypes} from 'redux-action-creator';

export const types = createTypes([
  'CREATE_STACK',
  'EDIT_STACK',
  'EDIT_GROUP',
  ...async('LOAD_STACKS'),
  ...async('ADD_STACK'),
  ...async('UPDATE_STACK'),
  ...async('REMOVE_STACK'),
  ...async('ADD_GROUP'),
  ...async('UPDATE_GROUP'),
  ...async('REMOVE_GROUP')
], 'STACKS');

export const actions = {
  createStack: actionCreator(types.CREATE_STACK),
  editStack: actionCreator(types.EDIT_STACK, 'stack'),
  editGroup: actionCreator(types.EDIT_GROUP, 'group'),
  loadStacks: asyncActionCreator(types.LOAD_STACKS, {
    client: () => get('/api/stacks'),
    server: ({injector}) => {
      const StackService = require('~/application/StackService').default;
      return injector.get(StackService).loadStacks();
    },
    schema: [Stack.normalizedSchema]
  }),
  addStack: asyncActionCreator(types.ADD_STACK, {
    client: ({title, gitPath, serverIds, diff}) => post('/api/stacks', {title, gitPath, serverIds, diff}),
    schema: Stack.normalizedSchema
  }),
  updateStack: asyncActionCreator(types.UPDATE_STACK, {
    client: ({stack, title, gitPath, serverIds, diff}) => post(`/api/stacks/${stack.slug}`, {title, gitPath, serverIds, diff}),
    schema: Stack.normalizedSchema
  }),
  removeStack: asyncActionCreator(types.REMOVE_STACK, ({stack}) => del(`/api/stacks/${stack.slug}`)),
  addGroup: asyncActionCreator(types.ADD_GROUP, {
    client: ({stack, name, serverIds}) => post(`/api/stacks/${stack.slug}/groups`, {name, serverIds}),
    schema: Stack.normalizedSchema
  }),
  updateGroup: asyncActionCreator(types.UPDATE_GROUP, {
    client: ({stack, group, name, serverIds}) => post(`/api/stacks/${stack.slug}/groups/${group.id}`, {name, serverIds}),
    schema: Stack.normalizedSchema
  }),
  removeGroup: asyncActionCreator(types.REMOVE_GROUP, {
    client: ({stack, group}) => del(`/api/stacks/${stack.slug}/groups/${group.id}`),
    schema: Stack.normalizedSchema
  })
};
