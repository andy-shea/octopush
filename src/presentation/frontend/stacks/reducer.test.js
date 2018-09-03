import {normalize} from 'normalizr';
import reducer, {initialState} from './reducer';
import {types} from './actions';
import {types as userActionTypes} from '../users/actions';
import {types as serverActionTypes} from '../servers/actions';
import Stack from '~/domain/stack/Stack';

describe('stacks reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should add stacks on USERS_LOGIN_SUCCESS', () => {
    expect(
      reducer(undefined, {
        type: userActionTypes.LOGIN_SUCCESS,
        response: normalize(
          {
            stacks: [
              {
                diff: 'https://atickettracker.com/test?from={{from}}&to={{to}}',
                servers: [
                  {hostname: 'syd01.foobar.com', id: 1},
                  {hostname: 'syd02.foobar.com', id: 2},
                  {hostname: 'bri01.foobar.com', id: 3}
                ],
                groups: [
                  {name: 'BRISBANE', servers: [{hostname: 'bri01.foobar.com', id: 3}], id: 2},
                  {
                    name: 'SYDNEY',
                    servers: [
                      {hostname: 'syd01.foobar.com', id: 1},
                      {hostname: 'syd02.foobar.com', id: 2}
                    ],
                    id: 1
                  }
                ],
                title: 'My Application',
                slug: 'my-application',
                gitPath: '/opt/git/repos',
                id: 1
              },
              {
                diff: 'diff',
                servers: [
                  {hostname: 'syd01.foobar.com', id: 1},
                  {hostname: 'syd02.foobar.com', id: 2}
                ],
                groups: [{name: 'SINGLE', servers: [{hostname: 'syd01.foobar.com', id: 1}], id: 3}],
                title: 'Other Application',
                slug: 'other-application',
                gitPath: '/var/ww/git/repo',
                id: 2
              }
            ]
          },
          {stacks: [Stack.normalizedSchema]}
        )
      })
    ).toEqual({
      map: {
        'my-application': {
          diff: 'https://atickettracker.com/test?from={{from}}&to={{to}}',
          servers: [1, 2, 3],
          groups: [
            {name: 'BRISBANE', servers: [3], id: 2},
            {name: 'SYDNEY', servers: [1, 2], id: 1}
          ],
          title: 'My Application',
          slug: 'my-application',
          gitPath: '/opt/git/repos',
          id: 1
        },
        'other-application': {
          diff: 'diff',
          servers: [1, 2],
          groups: [{name: 'SINGLE', servers: [1], id: 3}],
          title: 'Other Application',
          slug: 'other-application',
          gitPath: '/var/ww/git/repo',
          id: 2
        }
      },
      loaded: true
    });
  });

  it('should add stack on STACKS_ADD_STACK_SUCCESS', () => {
    expect(
      reducer(
        {map: {}},
        {
          type: types.ADD_STACK_SUCCESS,
          response: normalize(
            {
              diff: 'http://diff.url',
              servers: [{hostname: 'bri01.foobar.com', id: 3}],
              groups: [],
              title: 'New Stack',
              slug: 'new-stack',
              gitPath: 'some/git/path',
              id: 3
            },
            Stack.normalizedSchema
          )
        }
      ).map
    ).toEqual({
      'new-stack': {
        diff: 'http://diff.url',
        servers: [3],
        groups: [],
        title: 'New Stack',
        slug: 'new-stack',
        gitPath: 'some/git/path',
        id: 3
      }
    });
  });

  it('should update server on STACKS_UPDATE_STACK_SUCCESS', () => {
    expect(
      reducer(
        {
          map: {
            'new-stack': {
              diff: 'http://diff.url',
              servers: [3],
              groups: [],
              title: 'New Stack',
              slug: 'new-stack',
              gitPath: 'some/git/path',
              id: 3
            }
          }
        },
        {
          type: types.UPDATE_STACK_SUCCESS,
          payload: {slug: 'new-stack'},
          response: normalize(
            {
              diff: 'http://diff.url',
              servers: [{hostname: 'bri01.foobar.com', id: 3}],
              groups: [],
              title: 'Updated Stack',
              slug: 'updated-stack',
              gitPath: 'some/git/path',
              id: 3
            },
            Stack.normalizedSchema
          )
        }
      ).map
    ).toEqual({
      'updated-stack': {
        diff: 'http://diff.url',
        servers: [3],
        groups: [],
        title: 'Updated Stack',
        slug: 'updated-stack',
        gitPath: 'some/git/path',
        id: 3
      }
    });
  });

  it('should remove the server on STACKS_REMOVE_STACK_SUCCESS', () => {
    expect(
      reducer(
        {
          map: {
            'new-stack': {
              diff: 'http://diff.url',
              servers: [3],
              groups: [],
              title: 'New Stack',
              slug: 'new-stack',
              gitPath: 'some/git/path',
              id: 3
            }
          }
        },
        {
          type: types.REMOVE_STACK_SUCCESS,
          payload: {slug: 'new-stack'}
        }
      )
    ).toEqual({map: {}});
  });

  it('should add group to stack on STACKS_ADD_GROUP_SUCCESS', () => {
    expect(
      reducer(
        {map: {}},
        {
          type: types.ADD_GROUP_SUCCESS,
          response: normalize(
            {
              diff: 'http://diff.url',
              servers: [{hostname: 'bri01.foobar.com', id: 3}],
              groups: [{name: 'group', servers: [{hostname: 'bri01.foobar.com', id: 3}], id: 4}],
              title: 'New Stack',
              slug: 'new-stack',
              gitPath: 'some/git/path',
              id: 3
            },
            Stack.normalizedSchema
          )
        }
      ).map
    ).toEqual({
      'new-stack': {
        diff: 'http://diff.url',
        servers: [3],
        groups: [
          {
            name: 'group',
            servers: [3],
            id: 4
          }
        ],
        title: 'New Stack',
        slug: 'new-stack',
        gitPath: 'some/git/path',
        id: 3
      }
    });
  });

  it('should update group on STACKS_UPDATE_GROUP_SUCCESS', () => {
    expect(
      reducer(
        {
          map: {
            'new-stack': {
              diff: 'http://diff.url',
              servers: [3],
              groups: [],
              title: 'New Stack',
              slug: 'new-stack',
              gitPath: 'some/git/path',
              id: 3
            }
          }
        },
        {
          type: types.UPDATE_GROUP_SUCCESS,
          response: normalize(
            {
              diff: 'http://diff.url',
              servers: [{hostname: 'bri01.foobar.com', id: 3}],
              groups: [{name: 'updated', servers: [{hostname: 'bri01.foobar.com', id: 3}], id: 4}],
              title: 'New Stack',
              slug: 'new-stack',
              gitPath: 'some/git/path',
              id: 3
            },
            Stack.normalizedSchema
          )
        }
      ).map
    ).toEqual({
      'new-stack': {
        diff: 'http://diff.url',
        servers: [3],
        groups: [
          {
            name: 'updated',
            servers: [3],
            id: 4
          }
        ],
        title: 'New Stack',
        slug: 'new-stack',
        gitPath: 'some/git/path',
        id: 3
      }
    });
  });

  it('should delete group on STACKS_REMOVE_GROUP_SUCCESS', () => {
    expect(
      reducer(
        {
          map: {
            'new-stack': {
              diff: 'http://diff.url',
              servers: [3],
              groups: [
                {
                  name: 'updated',
                  servers: [3],
                  id: 4
                }
              ],
              title: 'New Stack',
              slug: 'new-stack',
              gitPath: 'some/git/path',
              id: 3
            }
          }
        },
        {
          type: types.REMOVE_GROUP_SUCCESS,
          response: normalize(
            {
              diff: 'http://diff.url',
              servers: [{hostname: 'bri01.foobar.com', id: 3}],
              groups: [],
              title: 'New Stack',
              slug: 'new-stack',
              gitPath: 'some/git/path',
              id: 3
            },
            Stack.normalizedSchema
          )
        }
      ).map
    ).toEqual({
      'new-stack': {
        diff: 'http://diff.url',
        servers: [3],
        groups: [],
        title: 'New Stack',
        slug: 'new-stack',
        gitPath: 'some/git/path',
        id: 3
      }
    });
  });

  it('should delete server from stacks and groups on SERVERS_REMOVE_SERVER_SUCCESS', () => {
    expect(
      reducer(
        {
          map: {
            'my-application': {
              diff: 'https://atickettracker.com/test?from={{from}}&to={{to}}',
              servers: [1, 2, 3],
              groups: [
                {name: 'BRISBANE', servers: [3], id: 2},
                {name: 'SYDNEY', servers: [1, 2], id: 1}
              ],
              title: 'My Application',
              slug: 'my-application',
              gitPath: '/opt/git/repos',
              id: 1
            },
            'other-application': {
              diff: 'diff',
              servers: [1, 2],
              groups: [{name: 'SINGLE', servers: [2], id: 3}],
              title: 'Other Application',
              slug: 'other-application',
              gitPath: '/var/ww/git/repo',
              id: 2
            }
          }
        },
        {
          type: serverActionTypes.REMOVE_SERVER_SUCCESS,
          payload: {serverId: 2},
          response: normalize(
            [
              {
                diff: 'https://atickettracker.com/test?from={{from}}&to={{to}}',
                servers: [
                  {hostname: 'syd01.foobar.com', id: 1},
                  {hostname: 'bri01.foobar.com', id: 3}
                ],
                groups: [
                  {name: 'BRISBANE', servers: [{hostname: 'bri01.foobar.com', id: 3}], id: 2},
                  {name: 'SYDNEY', servers: [{hostname: 'syd01.foobar.com', id: 1}], id: 1}
                ],
                title: 'My Application',
                slug: 'my-application',
                gitPath: '/opt/git/repos',
                id: 1
              },
              {
                diff: 'diff',
                servers: [{hostname: 'syd01.foobar.com', id: 1}],
                groups: [],
                title: 'Other Application',
                slug: 'other-application',
                gitPath: '/var/ww/git/repo',
                id: 2
              }
            ],
            [Stack.normalizedSchema]
          )
        }
      ).map
    ).toEqual({
      'my-application': {
        diff: 'https://atickettracker.com/test?from={{from}}&to={{to}}',
        servers: [1, 3],
        groups: [{name: 'BRISBANE', servers: [3], id: 2}, {name: 'SYDNEY', servers: [1], id: 1}],
        title: 'My Application',
        slug: 'my-application',
        gitPath: '/opt/git/repos',
        id: 1
      },
      'other-application': {
        diff: 'diff',
        servers: [1],
        groups: [],
        title: 'Other Application',
        slug: 'other-application',
        gitPath: '/var/ww/git/repo',
        id: 2
      }
    });
  });
});
