import {types} from './actions';
import {types as userActionTypes} from '../users/actions';
import {types as serverActionTypes} from '../servers/actions';

export const initialState = {
  map: {},
  loaded: false
};

function mergeStacks(state, action) {
  const {
    entities: {stacks},
    result
  } = action.response;
  return {...state, map: {...state.map, ...stacks}, stackEditing: result, groupEditing: undefined};
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case userActionTypes.LOGIN_SUCCESS: {
      return {...state, map: {...state.map, ...action.response.entities.stacks}, loaded: true};
    }

    case types.CREATE_STACK:
      return {...state, stackEditing: true};

    case types.EDIT_STACK:
      return {
        ...state,
        stackEditing: action.payload.stack ? action.payload.stack.slug : undefined,
        groupEditing: undefined
      };

    case types.ADD_STACK_SUCCESS:
    case types.REMOVE_GROUP_SUCCESS:
    case types.UPDATE_GROUP_SUCCESS:
    case types.ADD_GROUP_SUCCESS:
      return {...mergeStacks(state, action)};

    case types.REMOVE_GROUP: {
      const {slug, group} = action.payload;
      const stack = state.map[slug];
      const nextGroups = [...stack.groups];
      const groupIndex = nextGroups.indexOf(group);
      nextGroups[groupIndex] = {...group, isDeleting: true};
      return {...state, map: {...state.map, [slug]: {...stack, groups: nextGroups}}};
    }

    case types.UPDATE_STACK_SUCCESS: {
      const {
        entities: {stacks},
        result
      } = action.response;
      const nextMap = {...state.map};
      delete nextMap[action.payload.slug];
      return {
        ...state,
        map: Object.assign(nextMap, stacks),
        stackEditing: result,
        groupEditing: undefined
      };
    }

    case types.REMOVE_STACK: {
      const {slug} = action.payload;
      const nextMap = {...state.map};
      nextMap[slug] = {...state.map[slug], isDeleting: true};
      return {...state, map: nextMap};
    }

    case types.REMOVE_STACK_SUCCESS: {
      const nextMap = {...state.map};
      delete nextMap[action.payload.slug];
      return {...state, map: nextMap, stackEditing: undefined, groupEditing: undefined};
    }

    case types.EDIT_GROUP: {
      return {...state, groupEditing: action.payload.group};
    }

    case serverActionTypes.REMOVE_SERVER_SUCCESS:
      return action.response.entities.stacks
        ? {...state, map: {...state.map, ...action.response.entities.stacks}}
        : state;

    default:
      return state;
  }
}

export default reducer;
