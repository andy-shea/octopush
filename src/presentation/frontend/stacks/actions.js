import {actionCreator, asyncActionCreator, async, createTypes} from 'redux-action-creator';
import {get, post, del} from '~/infrastructure/fetch';
import action from '../action';
import Stack from '~/domain/stack/Stack';

export const types = createTypes(
  [
    'CREATE_STACK',
    'EDIT_STACK',
    ...async('LOAD_STACKS'),
    ...async('ADD_STACK'),
    ...async('UPDATE_STACK'),
    ...async('REMOVE_STACK'),
    ...async('ADD_GROUP'),
    ...async('UPDATE_GROUP'),
    ...async('REMOVE_GROUP')
  ],
  'STACKS'
);

export const actions = {
  createStack: actionCreator(types.CREATE_STACK),
  editStack: actionCreator(types.EDIT_STACK, 'stack'),
  loadStacks: asyncActionCreator(types.LOAD_STACKS, {
    action: () => get('/api/stacks'),
    schema: [Stack.normalizedSchema]
  }),
  addStack: asyncActionCreator(types.ADD_STACK, 'title', 'gitPath', 'serverIds', 'diff', {
    action: action(payload => post('/api/stacks', payload)),
    schema: Stack.normalizedSchema
  }),
  updateStack: asyncActionCreator(
    types.UPDATE_STACK,
    'slug',
    'title',
    'gitPath',
    'serverIds',
    'diff',
    {
      action: action(({slug, ...payload}) => post(`/api/stacks/${slug}`, payload)),
      schema: Stack.normalizedSchema
    }
  ),
  removeStack: asyncActionCreator(types.REMOVE_STACK, 'slug', ({slug}) =>
    del(`/api/stacks/${slug}`)
  ),
  addGroup: asyncActionCreator(types.ADD_GROUP, 'slug', 'name', 'serverIds', {
    action: action(({slug, ...payload}) => post(`/api/stacks/${slug}/groups`, payload)),
    schema: Stack.normalizedSchema
  }),
  updateGroup: asyncActionCreator(types.UPDATE_GROUP, 'slug', 'groupId', 'name', 'serverIds', {
    action: action(({slug, groupId, ...payload}) =>
      post(`/api/stacks/${slug}/groups/${groupId}`, payload)
    ),
    schema: Stack.normalizedSchema
  }),
  removeGroup: asyncActionCreator(types.REMOVE_GROUP, 'slug', 'group', {
    action: ({slug, group}) => del(`/api/stacks/${slug}/groups/${group.id}`),
    schema: Stack.normalizedSchema
  })
};
