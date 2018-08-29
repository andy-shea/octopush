import {types} from './actions';
import {types as userActionTypes} from '../users/actions';

function reducer(state = {map: {}, loaded: false}, action) {
  switch (action.type) {
    case userActionTypes.LOGIN_SUCCESS: {
      return {...state, map: {...state.map, ...action.response.entities.servers}, loaded: true};
    }

    case types.EDIT_SERVER: {
      const {server} = action.payload;
      return {...state, serverEditing: server && server.id.toString()};
    }

    case types.ADD_SERVER_SUCCESS:
    case types.UPDATE_SERVER_SUCCESS:
      return {
        ...state,
        map: {...state.map, ...action.response.entities.servers},
        serverEditing: undefined
      };

    case types.REMOVE_SERVER: {
      const {serverId} = action.payload;
      const nextMap = {...state.map};
      nextMap[serverId] = {...state.map[serverId], isDeleting: true};
      return {...state, map: nextMap};
    }

    case types.REMOVE_SERVER_SUCCESS:
      const nextMap = {...state.map};
      delete nextMap[action.payload.serverId];
      return {...state, map: nextMap};

    default:
      return state;
  }
}

export default reducer;
