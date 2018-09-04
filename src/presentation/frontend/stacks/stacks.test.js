import React from 'react';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {render, within, cleanup, fireEvent} from 'react-testing-library';
import StacksContainer from './StacksContainer';
import stacksReducer from './reducer';
import serversReducer from '../servers/reducer';

const servers = {
  map: {
    1: {hostname: 'syd01.foobar.com', id: 1},
    2: {hostname: 'syd02.foobar.com', id: 2},
    3: {hostname: 'bri01.foobar.com', id: 3}
  }
};

const myApplication = {
  diff: 'https://atickettracker.com/test?from={{from}}&to={{to}}',
  servers: [1, 2, 3],
  groups: [{name: 'SYDNEY', servers: [1, 2], id: 1}, {name: 'BRISBANE', servers: [3], id: 2}],
  title: 'My Application',
  slug: 'my-application',
  gitPath: '/opt/git/repos',
  id: 1
};

const otherApplication = {
  diff: 'diff',
  servers: [1, 2],
  groups: [{name: 'asdasd', servers: [1], id: 3}],
  title: 'Other Application',
  slug: 'other-application',
  gitPath: '/var/ww/git/repo',
  id: 2
};

function click(element) {
  fireEvent(
    element,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
  );
}

function getState(...stacks) {
  const initialState = {
    servers,
    stacks: {
      map: {}
    }
  };
  for (const stack of stacks) {
    initialState.stacks.map[stack.slug] = {...stack};
  }
  return initialState;
}

function renderWithRedux(view, initialState) {
  const store = createStore(
    combineReducers({stacks: stacksReducer, servers: serversReducer}),
    initialState
  );
  return render(<Provider store={store}>{view}</Provider>);
}

afterEach(cleanup);

describe('stacks', () => {
  it('renders an empty list if no stacks present', () => {
    const {getByTestId, getByText} = renderWithRedux(<StacksContainer />, getState());
    expect(getByTestId('stacks').children).toHaveLength(0);
    expect(getByText('Stacks')).toBeDefined();
    expect(getByText('Add New Stack')).toBeDefined();
  });

  it('renders stacks', () => {
    const state = getState(myApplication, otherApplication);
    const {getByTestId, getByText} = renderWithRedux(<StacksContainer />, state);
    expect(getByTestId('stacks').children).toHaveLength(Object.keys(state.stacks.map).length);
    for (const stack of Object.values(state.stacks.map)) {
      expect(getByText(stack.title)).toBeDefined();
    }
  });

  it('renders stack with edit and remove buttons', () => {
    const {getByText} = renderWithRedux(<StacksContainer />, getState(myApplication));
    expect(getByText('Edit stack')).toBeDefined();
    expect(getByText('Remove stack')).toBeDefined();
  });

  it('renders a form for manipulating servers on add new stack', () => {
    const {getByText, queryByText, getByPlaceholderText} = renderWithRedux(
      <StacksContainer />,
      getState()
    );
    click(getByText('Add New Stack'));
    expect(getByText('New Stack')).toBeDefined();
    expect(getByPlaceholderText('Title')).toBeDefined();
    expect(getByPlaceholderText('Git Path')).toBeDefined();
    expect(getByText('Server Whitelist')).toBeDefined();
    expect(getByPlaceholderText('Diff URL')).toBeDefined();
    expect(getByText('Add')).toBeDefined();
    expect(queryByText('Server Groups')).toBeNull();
  });

  it('can edit a stack', () => {
    const {getByTestId, getByText} = renderWithRedux(
      <StacksContainer />,
      getState(otherApplication)
    );
    click(getByText('Edit stack'));
    const {title, gitPath, diff, servers: stackServers, groups} = otherApplication;
    const withinStackForm = within(getByTestId('stack-form'));
    expect(withinStackForm.getByPlaceholderText('Title').value).toEqual(title);
    expect(withinStackForm.getByPlaceholderText('Git Path').value).toEqual(gitPath);
    for (const serverId of stackServers) {
      expect(withinStackForm.getByText(servers.map[serverId].hostname)).toBeDefined();
    }
    expect(withinStackForm.getByPlaceholderText('Diff URL').value).toEqual(diff);
    expect(withinStackForm.getByText('Save')).toBeDefined();
    expect(getByTestId('groups').children).toHaveLength(groups.length);
    for (const group of Object.values(groups)) {
      expect(getByText(group.name)).toBeDefined();
    }
  });

  it('renders group with edit and remove buttons', () => {
    const {getByText} = renderWithRedux(<StacksContainer />, getState(otherApplication));
    click(getByText('Edit stack'));
    expect(getByText('Edit group')).toBeDefined();
    expect(getByText('Remove group')).toBeDefined();
  });

  it('can edit a group', () => {
    const {getByText, getByTestId} = renderWithRedux(
      <StacksContainer />,
      getState(otherApplication)
    );
    click(getByText('Edit stack'));
    click(getByText('Edit group'));
    const {groups} = otherApplication;
    const withinGroupForm = within(getByTestId('group-form'));
    expect(withinGroupForm.getByPlaceholderText('Name').value).toEqual(groups[0].name);
    expect(withinGroupForm.getByText(servers.map[groups[0].servers[0]].hostname)).toBeDefined();
    expect(withinGroupForm.getByText('Save')).toBeDefined();
  });
});
