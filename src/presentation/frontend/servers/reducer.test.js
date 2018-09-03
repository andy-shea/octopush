import {normalize} from 'normalizr';
import reducer, {initialState} from './reducer';
import {types} from './actions';
import {types as userActionTypes} from '../users/actions';
import Server from '~/domain/server/Server';

describe('servers reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should add servers on USERS_LOGIN_SUCCESS', () => {
    expect(
      reducer(undefined, {
        type: userActionTypes.LOGIN_SUCCESS,
        response: normalize(
          {
            servers: [
              {hostname: 'bri01.foobar.com', id: 3},
              {hostname: 'syd01.foobar.com', id: 1},
              {hostname: 'syd02.foobar.com', id: 2}
            ]
          },
          {servers: [Server.normalizedSchema]}
        )
      })
    ).toEqual({
      map: {
        1: {hostname: 'syd01.foobar.com', id: 1},
        2: {hostname: 'syd02.foobar.com', id: 2},
        3: {hostname: 'bri01.foobar.com', id: 3}
      },
      loaded: true
    });
  });

  it('should add server on SERVERS_ADD_SERVER_SUCCESS', () => {
    expect(
      reducer(
        {map: {}},
        {
          type: types.ADD_SERVER_SUCCESS,
          response: normalize({hostname: 'server', id: 4}, Server.normalizedSchema)
        }
      )
    ).toEqual({
      map: {
        4: {hostname: 'server', id: 4}
      }
    });
  });

  it('should update server on SERVERS_UPDATE_SERVER_SUCCESS', () => {
    expect(
      reducer(
        {map: {4: {hostname: 'server', id: 4}}},
        {
          type: types.UPDATE_SERVER_SUCCESS,
          response: normalize({hostname: 'updated', id: 4}, Server.normalizedSchema)
        }
      )
    ).toEqual({
      map: {
        4: {hostname: 'updated', id: 4}
      }
    });
  });

  it('should remove the server on SERVERS_REMOVE_SERVER_SUCCESS', () => {
    expect(
      reducer(
        {map: {4: {hostname: 'server', id: 4}}},
        {
          type: types.REMOVE_SERVER_SUCCESS,
          payload: {serverId: 4}
        }
      )
    ).toEqual({map: {}});
  });
});
