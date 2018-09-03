import {normalize} from 'normalizr';
import reducer, {initialState} from './reducer';
import {types} from './actions';
import User from '~/domain/user/User';

describe('users reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle USERS_LOGIN_SUCCESS', () => {
    expect(
      reducer(undefined, {
        type: types.LOGIN_SUCCESS,
        response: normalize(
          {user: {id: 1, name: 'Joe Blog', email: 'joe@blog.com'}},
          {user: User.normalizedSchema}
        )
      })
    ).toEqual({
      map: {
        1: {
          id: 1,
          name: 'Joe Blog',
          email: 'joe@blog.com'
        }
      },
      authenticatedUser: 1
    });
  });
});
