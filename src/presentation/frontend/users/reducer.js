import {types} from './actions';
import {types as deployTypes} from '../deploys/actions';

function reducer(state = {map: {}}, action) {
  switch (action.type) {
    case deployTypes.LOAD_DEPLOYS_BRANCHES_SUCCESS: return {...state, map: {...state.map, ...action.response.entities.users}};

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
