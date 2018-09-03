import {types} from './actions';
import {types as routerTypes} from '../router/routes';

export const initialState = {
  map: {}
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case routerTypes.STACK_SUCCESS:
      return {...state, map: {...state.map, ...action.response.entities.users}};

    case types.LOGIN_SUCCESS:
      return {
        map: {...state.map, ...action.response.entities.users},
        authenticatedUser: action.response.result.user
      };

    default:
      return state;
  }
}

export default reducer;
