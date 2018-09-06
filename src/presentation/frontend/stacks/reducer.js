import produce from 'immer';
import {types} from './actions';
import {types as userActionTypes} from '../users/actions';
import {types as serverActionTypes} from '../servers/actions';

export const initialState = {
  map: {},
  loaded: false
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case userActionTypes.LOGIN_SUCCESS: {
      Object.assign(draft.map, action.response.entities.stacks);
      draft.loaded = true;
      break;
    }

    case types.CREATE_STACK:
      draft.stackEditing = true;
      break;

    case types.EDIT_STACK:
      draft.stackEditing = action.payload.stack ? action.payload.stack.slug : undefined;
      draft.groupEditing = undefined;
      break;

    case types.ADD_STACK_SUCCESS:
    case types.REMOVE_GROUP_SUCCESS:
    case types.UPDATE_GROUP_SUCCESS:
    case types.ADD_GROUP_SUCCESS: {
      const {entities, result} = action.response;
      draft.stackEditing = result;
      Object.assign(draft.map, entities.stacks);
      break;
    }

    case types.REMOVE_GROUP: {
      const {slug, group} = action.payload;
      draft.map[slug].groups.find(({id}) => id === group.id).isDeleting = true;
      break;
    }

    case types.UPDATE_STACK_SUCCESS: {
      const {entities, result} = action.response;
      delete draft.map[action.payload.slug];
      draft.stackEditing = result;
      Object.assign(draft.map, entities.stacks);
      break;
    }

    case types.REMOVE_STACK: {
      draft.map[action.payload.slug].isDeleting = true;
      break;
    }

    case types.REMOVE_STACK_SUCCESS: {
      delete draft.map[action.payload.slug];
      draft.stackEditing = undefined;
      break;
    }

    case serverActionTypes.REMOVE_SERVER_SUCCESS: {
      Object.assign(draft.map, action.response.entities.stacks);
      break;
    }
  }
}, initialState);

export default reducer;
