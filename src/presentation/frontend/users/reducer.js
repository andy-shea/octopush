import {types} from './actions';
import {types as routerTypes} from '../router/routes';

function reducer(state = {map: {}}, action) {
  switch (action.type) {
    case routerTypes.STACK_SUCCESS: return {...state, map: {...state.map, ...action.response.entities.users}};

    case types.LOGIN: return {...state, isActioning: true, error: undefined};

    case types.LOGIN_SUCCESS: return {
      map: {...state.map, ...action.response.entities.users},
      authenticatedUser: action.response.result.user,
      isActioning: false
    };

    case types.LOGIN_FAIL: return {...state, isActioning: false, error: {message: 'Incorrect email or password'}};

    default: return state;
  }
}

export default reducer;
