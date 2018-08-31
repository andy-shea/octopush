import {get, post, del} from '../utils/fetch';
import Stack from '~/domain/stack/Stack';
import {actionCreator, asyncActionCreator, async, createTypes} from 'redux-action-creator';

export const types = createTypes(
  [
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
  ],
  'STACKS'
);

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
  addStack: asyncActionCreator(types.ADD_STACK, 'title', 'gitPath', 'serverIds', 'diff', {
    client: async (payload, {setSubmitting, setErrors}) => {
      try {
        const response = await post('/api/stacks', payload);
        setSubmitting(false);
        return response;
      }
      catch (error) {
        setErrors(error.response.data);
      }
    },
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
      client: async ({slug, ...payload}, {setSubmitting, setErrors}) => {
        try {
          const response = await post(`/api/stacks/${slug}`, payload);
          setSubmitting(false);
          return response;
        }
        catch (error) {
          setErrors(error.response.data);
        }
      },
      schema: Stack.normalizedSchema
    }
  ),
  removeStack: asyncActionCreator(types.REMOVE_STACK, 'slug', ({slug}) =>
    del(`/api/stacks/${slug}`)
  ),
  addGroup: asyncActionCreator(types.ADD_GROUP, 'slug', 'name', 'serverIds', {
    client: async ({slug, ...payload}, {resetForm, setErrors}) => {
      try {
        const response = await post(`/api/stacks/${slug}/groups`, payload);
        resetForm();
        return response;
      }
      catch (error) {
        setErrors(error.response.data);
      }
    },
    schema: Stack.normalizedSchema
  }),
  updateGroup: asyncActionCreator(types.UPDATE_GROUP, 'slug', 'groupId', 'name', 'serverIds', {
    client: async ({slug, groupId, ...payload}, {resetForm, setErrors}) => {
      try {
        const response = await post(`/api/stacks/${slug}/groups/${groupId}`, payload);
        resetForm();
        return response;
      }
      catch (error) {
        setErrors(error.response.data);
      }
    },
    schema: Stack.normalizedSchema
  }),
  removeGroup: asyncActionCreator(types.REMOVE_GROUP, 'slug', 'group', {
    client: ({slug, group}) => del(`/api/stacks/${slug}/groups/${group.id}`),
    schema: Stack.normalizedSchema
  })
};
