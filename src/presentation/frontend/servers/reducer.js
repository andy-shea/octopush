import produce from 'immer';
import {types} from './actions';
import {types as userActionTypes} from '../users/actions';

export const initialState = {
  map: {},
  loaded: false
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case userActionTypes.LOGIN_SUCCESS: {
      Object.assign(draft.map, action.response.entities.servers);
      draft.loaded = true;
      break;
    }

    case types.ADD_SERVER_SUCCESS:
    case types.UPDATE_SERVER_SUCCESS:
      Object.assign(draft.map, action.response.entities.servers);
      break;

    case types.REMOVE_SERVER_SUCCESS:
      delete draft.map[action.payload.serverId];
      break;
  }
}, initialState);

export default reducer;
