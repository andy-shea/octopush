import produce from 'immer';
import {types} from './actions';
import {types as routerTypes} from '../router/routes';

export const initialState = {
  map: {}
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case routerTypes.STACK_SUCCESS:
      Object.assign(draft.map, action.response.entities.users);
      break;

    case types.LOGIN_SUCCESS:
      Object.assign(draft.map, action.response.entities.users);
      draft.authenticatedUser = action.response.result.user;
  }
}, initialState);

export default reducer;
